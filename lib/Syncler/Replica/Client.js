Class('Syncler.Replica.Client', {
    
    isa     : 'Syncler.Replica',
    
    use     : 'Syncler.Topic',
    
    
    has : {
        socket              : {
            required    : true,
            
            handles     : [ 'connect', 'disconnect', 'send' ]
        },
        
        isSettingUp     : false,
        setupCONT       : null,
        setupParams     : null,
        
        serverReceipt   : null
    },
    
    
    after : {
        
        initialize : function () {
            var socket  = this.socket
            var me      = this
            
            socket.on('connect', function () {
                
                me.onSocketConnect.apply(me, arguments)
            }) 
            
            socket.on('message', function () {
                
                me.onSocketMessage.apply(me, arguments)
            }) 

            socket.on('disconnect', function () {
                
                me.onSocketDisonnect.apply(me, arguments)
            }) 
        }
    },
    
    
    methods : {
        
        onSocketConnect : function () {
            if (this.isSettingUp) {
                
                var topic       = config.topic
                
                if (topic) 
                    this.createTopic(topic)
                else
                    if (config.topicID)
                        this.fetchTopic(config.topicID)
                
            }
        },
        
            
        onSocketMessage : function (message) {
            if (this.isSettingUp) {
                this.isSettingUp = false

                var setupCONT = this.setupCONT
                delete this.setupCONT
                
                if (message.type == 'createTopic-result') {
                    setupCONT.CONTINUE(this)
                    
                    return
                }
                
                
                if (message.type == 'fetchTopic-result') {
                    var me              = this
                    
                    // XXX!!! switch to synchronous animation
                    TRY(this.scope).animatePacket(topicPacket).then(function (object, array) {
                        
                        me.setTopic(array[0])
                        
                        setupCONT.CONTINUE(me)
                        
                    }).except(function (e) {
                        
                        setupCONT.THROW(e)
                        
                    }).now()
                }
            } else {
                
                if (message.type == 'commitOwnMutation') this.commitOwnMutation(message.acceptNum, message.commitNum)
                
                if (message.type == 'commitNewMutation') this.commitNewMutation(message.mutationPacket)
            }
        },
        
            
        onSocketDisonnect : function () {
            if (this.isSettingUp) {
                this.isSettingUp = false
                
                var setupCONT = this.setupCONT
                delete this.setupCONT
                
                setupCONT.THROW("Connection error")
            }
        },
        
        
        createTopic : function (topic) {
            
            if (!topic.meta.does(Syncler.Topic)) throw "Topic doesn't implement a `Syncler.Topic` role"
            
            this.setTopic(topic)

            
            var topicPacket     = scope.includeNewObjects({}, [ topic ])
            
            topicPacket.topicID = topic.getTopicID()
            topicPacket.type    = 'createTopic'
            
            this.send(topicPacket)
        },
        
        
        fetchTopic : function (topicID) {
            if (this.topic) throw "Already have topic [" + this.topic.getTopicID() + "] and trying to fetch another one"
            
            this.scope.registerProxy(this, 'replica:' + topicID)
            
            this.send({
                type    : 'fetchTopic',
                topicID : topicID
            })
        },
        
        
        commitOwnMutation : function (acceptNum, commitNum) {
            var mutation = this.getOwnMutation(acceptNum)
            
            mutation.commitNum = commitNum
            
            this.commit(mutation)
        },
        
        
        commitNewMutation : function (mutationPacket) {
            // XXX!!! switch to synchronous animation
            TRY(this.scope).animatePacket(mutationPacket).then(function (object, array) {
                
                var mutation = array[0]
                
                this.commit(mutation)
                
            }).now()
        },
        
        
        
        commit : function (mutation) {
            var appliedIndex = this.appliedIndexOf(mutation)
            
            if (appliedIndex != -1) {
                
                var commutativeWithAll = true
                
                for (var i = this.tentativeQueue.length - 1; i >= 0; i--) {
                    
                    var appliedMut = this.tentativeQueue[i]
                    
                    commutativeWithAll = commutativeWithAll && (mutation.commutativeWith(appliedMut) || appliedMut.commutativeWith(mutation))
                    
                    if (!commutativeWithAll) break
                }
                
                if (!commutativeWithAll) {
                    var unappliedMutations  = []
                    
                    for (var i = this.tentativeQueue.length - 1; i > this.latestCommitNum; i--) {
                        
                        var appliedMut = this.tentativeQueue[i]
                        
                        unappliedMutations.unshift(appliedMut.unapply(this))
                    }
                }
                
                var finalResult = mutation.apply(this)
                
                this.tentativeQueue.splice(this)
                
                if (!commutativeWithAll) {
                    
                    Joose.A.each(unappliedMutations, function (mutation) {
                        
                        mutation.apply(this)
                        
                    }, this)
                }
                
            }
        }
        
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function (config) {
                if (this.isSettingUp) throw "Double setup"
                
                this.isSettingUp    = true
                
                this.setupCONT      = this.CONT
                this.setupParams    = config
                
                this.connect()
            }
        }
    }
    // eof continued
    
})