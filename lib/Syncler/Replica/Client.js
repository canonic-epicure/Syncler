Class('Syncler.Replica.Client', {
    
    isa     : 'Syncler.Replica',
    
    use     : [
        'Syncler.Topic',
        'JSON2'
    ],
    
    
    has : {
        socketClient    : {
            required    : true,
            
            handles     : [ 'connect', 'disconnect', 'send' ]
        },
        
        isSettingUp     : false,
        ready           : false,
        
        messageHandler      : null,
        disconnectHandler   : null,
        
        
        latestKnownCommitNum        : null
    },
    
    
    after : {
        
        acceptMutation : function (mutation) {
            
            if (this.isSettingUp) throw "Can't accept any mutations - setup in progress"
            
            // only send mutations after the replica has been set up
            if (this.ready) { 
            
                var mutationPacket = this.scope.includeNewObjects({}, [ mutation ])
                
                this.send({
                    type                    : 'update',
                    latestKnownCommitNum    : this.latestKnownCommitNum,
                    mutationPacket          : mutationPacket
                })
                
//                console.log('Sending message: ' + JSON2.stringify(mutationPacket))
            }
        }
    },
    
    
    methods : {
        
        onSocketMessage : function (message) {
//            console.log('Incoming message: ' + JSON2.stringify(message))
            
            if (message.type == 'commitOwnMutation') 
                this.commitOwnMutation(message.acceptNum, message.commitNum)
            else
                if (message.type == 'commitNewMutation') 
                    this.commitNewMutation(message.commitNum, message.mutationPacket)
                else
                    throw "Wrong type of message: " + JSON2.stringify(message)
        },
        
        
        onSocketDisconnect : function () {
//            console.log('client [' + this.clientID + '] disconnected')
        },
        
            
        createReplica : function (topic) {
            
            if (!topic.meta.does(Syncler.Topic)) throw "Topic doesn't implement a `Syncler.Topic` role"
            
            this.setTopic(topic)
            
            var scope       = this.scope.backend.newScope()
            
            scope.registerProxy(this, 'replica:' + topic.getTopicID())
            
            this.reset()
            
            var topicPacket     = scope.includeNewObjects({}, [ topic ])
            
//            console.log('Sending topic: ' + JSON2.stringify(topicPacket))

            this.send({
                type            : 'createReplica',
                
                clientID        : this.clientID,
                
                topicID         : topic.getTopicID(),
                topicPacket     : topicPacket
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
            if (acceptNum != this.tentativeQueue[0].acceptNum) throw "Should never commit mutations other than first from tentative queue"
            
            var mutation = this.getTentativeMutation(acceptNum)
            
            this.latestKnownCommitNum = mutation.commitNum = commitNum
            
            this.commit(mutation)
        },
        
        
        commitNewMutation : function (commitNum, mutationPacket) {
            
            var result = this.scope.animatePacketSync(mutationPacket)
            
            var mutation = result.array[0]
            
            this.latestKnownCommitNum = mutation.commitNum = commitNum
                
            this.commit(mutation)
        },
        
        
        commit : function (mutation) {
            if (!mutation.commitNum) throw "Can't commit mutation - has no `commitNum`"
            
            var tentativeQueue  = this.tentativeQueue
            var committedQueue  = this.committedQueue
            
            if (mutation == tentativeQueue[0])
                
                this.pushToCommitted(this.shiftFromTentative())
                
            else if (this.mutationCommutativeWithTentatives(mutation)) {
                
                mutation.apply(this)
                
                this.pushToCommitted(mutation)
                
            } else {
                this.undoTentative()
                
                mutation.apply(this)
                
                this.pushToCommitted(mutation)
                
                this.redoTentative()
            }
            
            mutation.fireEvent('commit', mutation)
            this.fireEvent('commit', this, mutation)
        }
        
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            // horrible mess a-la common-js
            setup : function (config) {
                if (this.isSettingUp || this.ready) throw "Double setup"
                
                this.isSettingUp    = true
                
                var me              = this
                
                var setupCONT       = this.CONT
                var socket          = this.socketClient
                
                var success         = function () {
                    
                    me.ready        = true
                    me.isSettingUp  = false
                    
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
                    socket.removeEvent('disconnect', onSocketEarlyDisconnect)
                    
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
                        else {
//                            console.log('Received topic: ' + JSON2.stringify(message.topicPacket))
                        
                            try {
                                var result = me.scope.animatePacketSync(message.topicPacket)
                                
                                me.setTopic(result.array[0])
                                
                            } catch (e) {
                                setupCONT.THROW(e)
                                
                                return
                            }
                            
                            success()
                        }
                        
                        return
                    }
                    
                    me.isSettingUp  = false
                    
                    setupCONT.THROW('Incorrect type of the first message')
                }
                
                
                var onSocketEarlyDisconnect = function () {
                    socket.removeEvent('disconnect', onSocketEarlyDisconnect)
                    me.isSettingUp  = false
                    
                    setupCONT.THROW('Connection error')
                }
                
                var onSocketConnect = function () {
                    clearTimeout(connectTimeout)
                    
//                    console.log('client [' + me.clientID + '] connected')
                    
                    var topic       = config.topic
                    var topicID     = config.topicID
                    
                    socket.on('message', onSocketMessage)
                    socket.removeEvent('connect', onSocketConnect)
                    socket.on('disconnect', onSocketEarlyDisconnect)
                    
                    if (topic) 
                        me.createReplica(topic)
                    else
                        if (topicID)
                            me.fetchReplica(topicID)
                }
                
                
                // XXX 'disconnect' won't be fired on connection error
                socket.on('connect', onSocketConnect) 
                
                var connectTimeout = setTimeout(function () {
                    me.isSettingUp  = false
                    socket.removeEvent('connect', onSocketConnect)
                    
                    setupCONT.THROW('Connection error')
                }, 2000)
                
                this.connect()
            }
        }
    }
    // eof continued
    
})