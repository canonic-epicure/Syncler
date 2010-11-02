Class('Syncler.Channel.Client', {
    
    isa     : 'Syncler.Channel',
    
    
    has : {
        internalQueue           : Joose.I.Array
    },
    
    
    methods : {
        
        getOutGoingChannelName : function () {
            return this.getChannelBaseName() + '/notify'
        },
        
        
        onVeroCommit : function (vero, packet) {
            this.internalQueue.push(packet)
            
            this.fireEvent('/channel/object/commit', this, vero.object, packet, vero)
        },
        
        
        commit : function () {
            var internalQueue = this.internalQueue
            
            if (internalQueue.length) {
            
                this.internalQueue      = []
                
                // gather only new nodes
                var packet = this.scope.includeNewObjects({}, internalQueue)
                
                this.publish(this.getOutGoingChannelName(), packet)
                
                this.fireEvent('/channel/commit', this, internalQueue)
            }
        }
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function (config) {
                
                var me          = this
                var scope       = this.scope
                
                // new topic
                if (config.topic) {
                    if (!topic.meta.does(Syncler.Vero.Role.Topic)) throw "Topic doesn't implement a `Syncler.Vero.Role.Topic` role"
                    
                    this.setTopic(topic)
                    
                    
                    scope.registerProxy(this, 'channel:' + topic.getTopicID())
    
                    
                    this.subscribeOnIncomingUpdates() // async
                    
                    scope.getBackend().createTopic(topic).andThen(function () {
                        
                        this.CONTINUE(me)
                    })
                    
                    return
                }
                
                var topicID     = config.topicID
                
                if (topicID) {
                    if (!this.topic) throw "Already have topic [" + this.topic.getTopicID() + "] and trying to fetch another one"
                
                    scope.registerProxy(this, 'channel:' + topicID)
                    
                    this.subscribeOnIncomingUpdates() // async
                    
                    scope.getBackend().fetchTopic(topicID).andThen(function (topic) {
                        
                        scope.includeNewObjects({}, [ topic ])
                        
                        me.setTopic(topic)
                        
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