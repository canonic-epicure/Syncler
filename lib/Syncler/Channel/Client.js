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
            
            fetchTopic : function (topicID) {
                
                var me          = this
                var scope       = this.scope
                
                scope.registerProxy(this, 'channel:' + topicID)
                
                this.subscribeOnIncomingUpdates() // async
                
                scope.getBackend().fetchTopic(topicID).andThen(function (topic) {
                    
                    scope.includeNewObjects({}, [ topic ])
                    
                    me.setTopic(topic)
                    
                    this.CONTINUE(me)
                })
            }
        }
    }
    // eof continued
    
})