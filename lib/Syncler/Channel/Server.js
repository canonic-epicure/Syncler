Class('Syncler.Channel.Server', {
    
    isa     : 'Syncler.Channel',
    
    
    has : {
        saving                  : false
    },
    
    
    methods : {
        
        getOutGoingChannelName : function () {
            return this.getChannelBaseName() + '/income'
        },
        
        
        getIncomingChannelName : function () {
            return this.getChannelBaseName() + '/notify'
        },
        
        
        saveTopic : function () {
            var me      = this
            
            if (this.saving) {
            
                console.log('Already saving topic, skipping')
                
                return
            }
            
            this.saving = true
            
            console.log('Saving topic')
            
            this.scope.store(this.getTopic()).then(function () {
                
                console.log('Saved topic successfully')
                
                console.log('Topic rev: ' + me.scope.objectToNode(me.getTopic()).REV)
                
                this.CONTINUE()
                
            }).except(function (e) {
                
                console.log('Error during saving topic: ' + e)
                
                this.CONTINUE()
            
            }).ensure(function (e) {
                
                me.saving = false
                
                this.CONTINUE()
                
            }).now()
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
                
                scope.lookUp(topicID).andThen(function (topic) {
                    
                    me.setTopic(topic)
                    
                    this.CONTINUE(me)
                })
            }
        }
    }
    // eof continued
    
})