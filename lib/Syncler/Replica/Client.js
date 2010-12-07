Class('Syncler.Replica.Client', {
    
    isa     : 'Syncler.Replica',
    
    use     : 'Syncler.Topic',
    
    
    has : {
        socketClient    : {
            required    : true,
            
            handles     : [ 'connect', 'disconnect', 'send' ]
        },
        
        isSettingUp     : false,
        
        messageHandler      : null,
        disconnectHandler   : null,
        
        
        serverReceipt   : null
    },
    
    
    methods : {
        
        onSocketMessage : function (message) {
            if (message.type == 'commitOwnMutation') this.commitOwnMutation(message.acceptNum, message.commitNum)
            
            if (message.type == 'commitNewMutation') this.commitNewMutation(message.mutationPacket)
        },
        
        
        onSocketDisconnect : function () {
        
        },
        
            
        createReplica : function (topic) {
            
            if (!topic.meta.does(Syncler.Topic)) throw "Topic doesn't implement a `Syncler.Topic` role"
            
            this.setTopic(topic)
            
            var scope       = this.scope.backend.newScope()
            
            scope.registerProxy(this, 'replica:' + topic.getTopicID())

            this.send({
                type            : 'createReplica',
                
                clientID        : this.clientID,
                
                topicID         : topic.getTopicID(),
                topicPacket     : scope.includeNewObjects({}, [ topic ])
            })
        },
        
        
        fetchReplica : function (topicID) {
            if (this.topic) throw "Already have topic [" + this.topic.getTopicID() + "] and trying to fetch another one"
            
            this.scope.registerProxy(this, 'replica:' + topicID)
            
            this.send({
                type            : 'fetchReplica',
                
                clientID        : this.clientID,
                
                topicID         : topicID
            })
        },
        
        
        commitOwnMutation : function (acceptNum, commitNum) {
            var mutation = this.getOwnMutation(acceptNum)
            
            mutation.commitNum = commitNum
            
            this.commit(mutation)
        },
        
        
        commitNewMutation : function (mutationPacket) {
            
            var result = this.scope.animatePacket(mutationPacket)
            
            var mutation = result.array[0]
                
            this.commit(mutation)
        },
        
        
        commit : function (mutation) {
//            var appliedIndex = this.appliedIndexOf(mutation)
//            
//            if (appliedIndex != -1) {
//                
//                var commutativeWithAll = true
//                
//                for (var i = this.tentativeQueue.length - 1; i >= 0; i--) {
//                    
//                    var appliedMut = this.tentativeQueue[i]
//                    
//                    commutativeWithAll = commutativeWithAll && (mutation.commutativeWith(appliedMut) || appliedMut.commutativeWith(mutation))
//                    
//                    if (!commutativeWithAll) break
//                }
//                
//                if (!commutativeWithAll) {
//                    var unappliedMutations  = []
//                    
//                    for (var i = this.tentativeQueue.length - 1; i > this.latestCommitNum; i--) {
//                        
//                        var appliedMut = this.tentativeQueue[i]
//                        
//                        unappliedMutations.unshift(appliedMut.unapply(this))
//                    }
//                }
//                
//                var finalResult = mutation.apply(this)
//                
//                this.tentativeQueue.splice(this)
//                
//                if (!commutativeWithAll) {
//                    
//                    Joose.A.each(unappliedMutations, function (mutation) {
//                        
//                        mutation.apply(this)
//                        
//                    }, this)
//                }
//                
//            }
        }
        
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function (config) {
                if (this.isSettingUp) throw "Double setup"
                
                this.isSettingUp    = true
                
                var me              = this
                
                var setupCONT       = this.CONT
                var socket          = this.socketClient
                
                var success         = function () {
                    
                    me.messageHandler = function (message) {
                        me.onSocketMessage(message)
                    }
                    
                    me.disconnectHandler = function () {
                        me.onSocketDisconnect()
                    }
                    
                    socket.on('message', me.messageHandler)
                    socket.on('disconnect', me.disconnectHandler)
                    
                    setupCONT.CONTINUE(me)
                }

                var onSocketMessage = function (message) {
                    socket.removeEvent('message', onSocketMessage)
                    socket.removeEvent('disconnect', onSocketDisconnect)
                    
                    if (message.type == 'createReplica-result') {
                        
                        if (message.error)
                            setupCONT.THROW(message.error)
                        else
                            success()
                        
                        return
                    }
                    
                    
                    if (message.type == 'fetchReplica-result') {
                        
                        if (message.error)
                            setupCONT.THROW(message.error)
                        else
                            try {
                                var result = me.scope.animatePacketSync(message.topicPacket)
                                
                                me.setTopic(result.array[0])
                                
                                success()
                                
                            } catch (e) {
                                setupCONT.THROW(e)
                            }
                        
                        return
                    }
                    
                    setupCONT.THROW('Incorrect type of the first message')
                }
                
                var onSocketConnect = function () {
                    
                    var topic       = config.topic
                    var topicID     = config.topicID
                    
                    socket.on('message', onSocketMessage)
                    socket.removeEvent('connect', onSocketConnect)
                    
                    if (topic) 
                        me.createReplica(topic)
                    else
                        if (topicID)
                            me.fetchReplica(topicID)
                }
                
                
                
                var onSocketDisconnect = function () {
                    socket.removeEvent('connect', onSocketConnect)
                    socket.removeEvent('disconnect', onSocketDisconnect)
                    
                    setupCONT.THROW('Connection error')
                }

                
                // XXX 'disconnect' won't be fired on connection error
                socket.on('connect', onSocketConnect) 
                socket.on('disconnect', onSocketDisconnect) 
                
                this.connect()
            }
        }
    }
    // eof continued
    
})