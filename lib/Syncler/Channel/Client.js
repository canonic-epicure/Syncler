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
                
                this.publish(this.getUpdateChannel(), packet)
                
                this.fireEvent('/channel/commit', this, internalQueue)
            }
        }
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            establish : function (topic) {
                
                if (!topic.meta.does(Syncler.Vero.Role.Topic)) throw "Topic doesn't implement a `Syncler.Vero.Role.Topic` role"
                
                this.setTopic(topic)
                
                var scope       = this.scope
                var me          = this
                
                scope.registerProxy(this, 'channel:' + topic.getTopicID())
                
                scope.store(topic)
                    
                this.subscribeOnIncomingUpdates().andThen(function (topicID) {
                    
                    me.publish('/vero/channel/new', { topicID : topicID })
                    
                    this.CONTINUE(me)
                })
            },
            
            
            
            fetchTopic : function (topicID) {
                
                var me          = this
                var scope       = this.scope
                
                scope.registerProxy(this, 'channel:' + topicID)
                
                this.subscribeOnIncomingUpdates()
                
                scope.getBackend().fetchTopic(topicID).andThen(function (topic) {
                    
                    me.setTopic(topic)
                    
                    this.CONTINUE(me)
                })
            }
            
        }
    }
})