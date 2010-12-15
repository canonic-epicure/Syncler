Class('Syncler.Replica.Server', {
    
    isa     : 'Syncler.Replica',
    
    
    has : {
//        bufferedSave            : false,
//        saving                  : false,
        receivedVector          : Joose.I.Object,
        committedVector         : Joose.I.Object,
        
        clients                 : Joose.I.Object,
        
        commitSeq               : 1,
        
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
            
//            this.on('update-idle', this.saveTopic, this)
//            
//            this.on('update-raw-message', this.translateUpdate, this)
//            
//            this.on('update-exception', this.onUpdateException, this)
        }
    },
    
    
    methods : {
        
        recordMutation : function (mutation) {
            var clientID            = mutation.clientID
            
            var knownAcceptNum      = this.receivedVector[ clientID ]
            
            if (knownAcceptNum != null)
                if (mutation.acceptNum != knownAcceptNum + 1) throw "Missed mutation"
            
            this.receivedVector[ clientID ] = mutation.acceptNum
        },
        
        
        onClientMessage : function (message, clientID) {
            if (message.type == 'update') {
                
                var result      = this.scope.animatePacketSync(message.mutationPacket)
                var mutation    = result.array[0]
                
                this.committedVector[ clientID ] = message.latestKnownCommitNum
                
                this.recordMutation(mutation)
                
                this.commit(mutation, message)
            }
        },
        
            
        onClientDisonnect : function (clientID) {
            console.log('CLIENT [' + clientID + '] gets DISCONNECTED')
        },
        
        
        commit : function (mutation, mutationMessage) {
            mutation.commitNum = this.commitSeq++
            
            mutation.apply(this)
            
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
                        
                        mutationPacket  : mutationMessage.mutationPacket,
                        commitNum       : mutation.commitNum
                    })
                
            })
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
        
        
        pruneCommitted : function () {
            var committedQueue          = this.committedQueue
            var committedVector         = this.committedVector
            var minGlobalCommittedNum   = 1e20
            
            Joose.O.each(this.clients, function (client, clientID) {
                
                if (committedVector[ clientID ] < minGlobalCommittedNum) minGlobalCommittedNum = committedVector[ clientID ]
            })
            
            while (committedQueue.length && committedQueue[0].commitNum <= minGlobalCommittedNum)
                this.shiftFromCommitted()
        },
        
        
//        onUpdateException : function (me, e) {
////            console.log('UPDATE EXCEPTION: ' + e)
//        },
//        
//        
//        translateUpdate : function (me, wrapper) {
//            console.log('TRANSLATING UPDATE: ' + JSON2.stringify(wrapper))
//            
//            console.log('TOPIC REV: ' + this.scope.idToNode(this.topic.getTopicID()).REV)
//            
//            this.publishRaw(this.getOutGoingReplicaName(), wrapper)
//        },
//        
//        
//        saveTopic : function () {
//            console.log('GONNA SAVE THE TOPIC')
//            
//            var me      = this
//            
//            if (this.saving) {
//                this.bufferedSave = true
//                
//                return
//            }
//            
//            this.saving         = true
//            this.bufferedSave   = false
//            
//            
//            var processedQueue = this.processedQueue
//            
//            this.processedQueue = []
//            
//            var objects = []
//            
//            Joose.A.each(processedQueue, function (element) {
//                
//                Joose.A.each(element.mutations, function (mutation) {
//                    
//                    objects.push(mutation, mutation.object)
//                })
//            })
//            
//            TRY(function () {
//                
//                me.scope.storeObjects({
//                    
//                    wIDs        : {},
//                    woIDs       : objects,
//                    
//                    mode        : 'store',
//                    isShallow   : true
//                    
//                }).then(function () {
//                    
//                    console.log('TOPIC SAVED SUCCESSFULLY, REV: ' + me.scope.idToNode(me.topic.getTopicID()).REV)
//                    
////                    var scope = this.scope
////                    
////                    var ids = {}
////                    
////                    Joose.A.map(objects, function (object) {
////                        
////                        ids[ scope.objectToId(object) ] = true
////                    })
////                    
////                    var idsArray = []
////                    
////                    Joose.O.each(ids, function (value, id) {
////                        idsArray.push(id)
////                    })
////                    
////                    console.log('IDS: ' + JSON2.stringify(idsArray))
//                    
//                    this.CONTINUE()
//                    
//                }, me).except(function (e) {
//                    
//                    console.log('ERROR SAVING TOPIC: ' + e)
//                    
//                    this.CONTINUE()
//                
//                }).ensure(function () {
//                    
//                    me.saving = false
//                    
//                    if (me.bufferedSave) me.saveTopic()
//                    
//                }).now()
//                
//            }).now()
//        },
        
        
        onReady : function (callback) {
            this.on('ready', callback, this, { single : true })
            
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
                        
                        me.fireEvent('ready', me)
                        
                        this.CONTINUE(me)
                    })
                    
                    return
                }
                
                var topicID     = config.topicID
                
                if (topicID) {
                    
                    scope.registerProxy(this, 'replica:' + topicID)
                    
                    
                    scope.lookUp(topicID).andThen(function (topic) {
                        
                        me.setTopic(topic)
                        
                        me.ready        = true
                        
                        me.fireEvent('ready', me)
                        
                        this.CONTINUE(me)
                    })
                    
                    return
                }
                
                throw "Incorrect arguments to `setup` method of [" + this + "]"
            }
        }
    }
    // eof continued
    
})