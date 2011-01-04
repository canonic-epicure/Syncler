Class('Syncler.Replica.Server', {
    
    isa     : 'Syncler.Replica',
    
    
    has : {
        receivedVector          : Joose.I.Object,
        committedVector         : Joose.I.Object,
        
        // do not includes server itself
        clients                 : Joose.I.Object,
        
        commitSeq               : 1,
        
        latestSavedCommit       : null,
        saving                  : false,
        hasBufferedSave         : false,
        
        persistLog              : true,
        
        ready                   : false,
        
        messageHandler          : null,
        disconnectHandler       : null,
        
        pruneCheckInterval      : 500,
        pruneIntervalID         : null
    },
    
    
    after : {
        
        initialize : function () {
            
            var me = this
            
            this.pruneIntervalID = setInterval(function () {
                
                me.pruneCommitted()
                
            }, this.pruneCheckInterval)
            
            this.on('commit', this.saveReplica, this, { buffer : 500, bufferMax : 500 })
        },
        
        
        addMutation : function (mutation) {
            
            // remove the mutation from the tentative queue - server commits immediately and directly
            this.shiftFromTentative()
            
            var mutationPacket = this.scope.includeNewObjects({}, [ mutation ])
            
            this.commit(mutation, mutationPacket, true)
        }
    },
    
    
    methods : {
        
        recordMutation : function (mutation) {
            var clientID            = mutation.clientID
            
            var knownAcceptNum      = this.receivedVector[ clientID ]
            
            if (knownAcceptNum != null)
                if (mutation.acceptNum != knownAcceptNum + 1) throw new Error("Missed mutation, knownAcceptNum = [" + knownAcceptNum + "], mutation.acceptNum = [" + mutation.acceptNum + "]")
            
            this.receivedVector[ clientID ] = mutation.acceptNum
        },
        
        
        onClientMessage : function (message, clientID) {
            if (message.type == 'update') {
                
//                console.log('INCOMING MUTATION ' + clientID)
//                console.log('Accepted update: ' + require('util').inspect(message.mutationPacket, false, 5))
                
                // XXX: this will modify the `message.mutationPacket` with __REF_ADR__ entries
                // when not running in ES5 (which has `defineProperty`)
                // `mutationPacket` should be saved before passing further to `commit`
                var result      = this.scope.animatePacketSync(message.mutationPacket)
                var mutation    = result.array[0]
                
                this.committedVector[ clientID ] = message.latestKnownCommitNum
                
                this.recordMutation(mutation)
                
                this.commit(mutation, message.mutationPacket)
            }
        },
        
            
        onClientDisonnect : function (clientID) {
            console.log('CLIENT [' + clientID + '] gets DISCONNECTED')
            
            var clients     = this.clients
            var client      = clients[ clientID ]
            
            delete  clients[ clientID ]

            Joose.O.each(clients, function (client, clientID) {
                
                client.send({ 
                    type            : 'clientDisconnect',
                    
                    clientID        : clientID
                })
            })
            
            this.fireEvent('client-disconnect', clientID, client)
            
            var flash = this.topic.FLASH
            
            if (flash instanceof Syncler.Topic.Flash) flash.remove(clientID)
        },
        
        
        commit : function (mutation, mutationPacket, isOwn) {
            mutation.commitNum = this.commitSeq++
            
            if (!isOwn) mutation.apply(this)
            
            this.committedQueue.push(mutation)
            
            Joose.O.each(this.clients, function (client, clientID) {
                
                if (clientID == mutation.clientID) 
                    client.send({ 
                        type        : 'commitOwnMutation',
                        
                        acceptNum   : mutation.acceptNum,
                        commitNum   : mutation.commitNum
                    })
                else
                    client.send({ 
                        type            : 'commitNewMutation',
                        
                        mutationPacket  : mutationPacket,
                        commitNum       : mutation.commitNum
                    })
                
            })
            
            this.fireEvent('commit', mutation, mutationPacket)
        },
        
        
        joinClient : function (socketClient, clientID) {
            var me = this
            
            this.clients[ clientID ] = socketClient
            
            me.messageHandler = function (message) {
                me.onClientMessage(message, clientID)
            }
            
            me.disconnectHandler = function () {
                me.onClientDisonnect(clientID)
            }
            
            socketClient.on('message', me.messageHandler)
            socketClient.on('disconnect', me.disconnectHandler)
        },
        
        
        // XXX need to take saved status into account
        // and release resources somehow..
        pruneCommitted : function () {
//            var committedQueue          = this.committedQueue
//            var committedVector         = this.committedVector
//            var minGlobalCommittedNum   = 1e20
//            
//            Joose.O.each(this.clients, function (client, clientID) {
//                
//                if (committedVector[ clientID ] < minGlobalCommittedNum) minGlobalCommittedNum = committedVector[ clientID ]
//            })
//            
//            while (committedQueue.length && committedQueue[0].commitNum <= minGlobalCommittedNum)
//                this.shiftFromCommitted()
        },
        
        
        saveReplica : function () {
            if (this.saving) {
                this.hasBufferedSave = true
                
                return
            }
            
            var committedQueue          = this.committedQueue
            var latestSavedCommit       = this.latestSavedCommit
            var persistLog              = this.persistLog
            
            if (latestSavedCommit == null) latestSavedCommit = committedQueue[ 0 ].commitNum - 1
            
            var ids                     = {}
            var objects                 = []
            var me                      = this
            
            Joose.A.each(committedQueue, function (mutation) {
                if (mutation.commitNum <= latestSavedCommit) return
                
//                if (!mutation.persistent) return
                
                Joose.A.each(mutation.getPersistentObjects(me, persistLog), function (object) {
                    var ID      = me.objectToId(object)
                    
                    if (ids[ ID ]) return
                    
                    ids[ ID ] = true
                    
                    objects.push(object)
                })
            })
            
            this.latestSavedCommit      = committedQueue[ committedQueue.length - 1].commitNum
            
            this.saving             = true
            this.hasBufferedSave    = false
            
            var scope               = this.scope
            
            
            console.log('GOING TO SAVE THE TOPIC')
            console.log('Latest saved commit:' + latestSavedCommit)
            console.log('Object length:' + objects.length)
            
            // XXX seems `apply` has limited in size of arguments need to pass array directly
            TRY(scope).update.apply(scope, objects).then(function () {
                
                console.log('TOPIC SAVED SUCCESSFULLY' + me.scope.idToNode(me.topic.getTopicID()).REV)
                
                this.CONTINUE()
                
            }).except(function (e) {
                
                console.log('ERROR SAVING TOPIC: ' + e + 'stack: ' + e.stack)
                
                this.CONTINUE()
            
            }).ensure(function () {
                
                me.saving = false
                
                if (me.hasBufferedSave) me.saveReplica()
                
                this.CONTINUE()
                
            }).now()
        },
        
        
        onReady : function (callback) {
            this.on('ready', function (e, replica) {
            
                callback(replica)
                
            }, this, { single : true })
            
            if (this.ready) this.fireEvent('ready', this)
        }
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function (config) {
                
                var me          = this
                var scope       = this.scope
                
                var topicPacket  = config.topicPacket
                
                // new topic from data packet
                if (topicPacket) {
                    
                    scope.registerProxy(this, 'replica:' + config.topicID)
                    
                    var result      = scope.animatePacketSync(topicPacket)
                    var topic       = result.array[0]
                    
                    me.setTopic(topic)
                    
                    // XXX implement `storePacket` or similar method 
                    scope.store(topic).andThen(function () {
                        
                        me.ready        = true
                        
                        this.CONTINUE(me)
                        
                        me.fireEvent('ready', me)
                    })
                    
                    return
                }
                
                var topicID     = config.topicID
                
                if (topicID) {
                    
                    scope.registerProxy(this, 'replica:' + topicID)
                    
                    
                    scope.lookUp(topicID).andThen(function (topic) {
                        
                        me.setTopic(topic)
                        
                        me.ready        = true
                        
                        this.CONTINUE(me)
                        
                        me.fireEvent('ready', me)
                    })
                    
                    return
                }
                
                throw "Incorrect arguments to `setup` method of [" + this + "]"
            }
        }
    }
    // eof continued
    
})