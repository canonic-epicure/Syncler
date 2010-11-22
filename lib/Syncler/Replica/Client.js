Class('Syncler.Replica.Client', {
    
    isa     : 'Syncler.Replica',
    
    use     : 'Syncler.Object.Role.Topic',
    
    
    has : {
        internalQueue           : Joose.I.Array
    },
    
    
    methods : {
        
        getOutGoingReplicaName : function () {
            return this.getReplicaBaseName() + '/notify'
        },
        
        
        commit : function () {
            var internalQueue = this.internalQueue
            
            if (internalQueue.length) {
            
                this.internalQueue      = []
                
                // gather only new nodes
                var packet = this.scope.includeNewObjects({}, internalQueue)
                
                this.publish(this.getOutGoingReplicaName(), packet)
                
                this.fireEvent('/replica/commit', this, internalQueue)
            }
        }
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function (config) {
                var me          = this
                var scope       = this.scope
                var backend     = scope.getBackend()
                
                var topic       = config.topic
                
                // new topic
                if (topic) {
                    if (!topic.meta.does(Syncler.Object.Role.Topic)) throw "Topic doesn't implement a `Syncler.Object.Role.Topic` role"
                    
                    this.setTopic(topic)
                    
                    scope.registerProxy(this, 'replica:' + topic.getTopicID())
    
                    
                    this.subscribeOnIncomingUpdates() // async
                    
                    this.internalQueue = [] // reset internal queue
                    
                    backend.createTopic(topic.getTopicID(), scope.includeNewObjects({}, [ topic ])).andThen(function () {
                        
                        this.CONTINUE(me)
                    })
                    
                    return
                }
                
                var topicID     = config.topicID
                
                if (topicID) {
                    if (this.topic) throw "Already have topic [" + this.topic.getTopicID() + "] and trying to fetch another one"
                
                    scope.registerProxy(this, 'replica:' + topicID)
                    
                    this.subscribeOnIncomingUpdates(topicID) // async
                    
                    backend.fetchTopic(topicID).andThen(function (topicPacket) {
                        
                        scope.animatePacket(topicPacket).andThen(function (object, array) {
                            
                            me.setTopic(array[0])
                            
                            this.CONTINUE(me)
                        })
                    })
                    
                    return
                }
                
                throw "Incorrect arguments to `setup` method of [" + this + "]"
            }
        }
    }
    // eof continued
    
})