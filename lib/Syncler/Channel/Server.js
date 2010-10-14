Class('Syncler.Channel.Server', {
    
    isa     : 'Syncler.Channel',
    
    
    has : {
        saving                  : false
    },
    
    
    methods : {
        
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
            
            setup : function (config) {
                
                if (config === Object(config) && config.topic) this.setTopic(config.topic)
                
                var topic       = this.getTopic()
                
                if (!topic) {
                    var internalQueue   = this.internalQueue    
                    
                    if (!internalQueue.length) throw "Can't determine a topic for [" + this + "]"
                    
                    topic = internalQueue[0].mutations[0].object
                    
                    this.setTopic(topic)
                }
                
                if (!topic.meta.does(Syncler.Vero.Role.Topic)) throw "Topic doesn't implement a `Syncler.Vero.Role.Topic` role"
                
                var scope       = this.scope
                var me          = this
                
                scope.registerProxy(this, 'channel:' + topic.getTopicID())
                
                me.internalQueue = []
                
                scope.store(topic).andThen(function (topicID) {
                    
//                    me.flush()
                    
                    
                    me.subscribeOnUpdates()
                    
                    me.publish('/vero/channel/new', { topicID : topicID })
                    
                    this.CONTINUE(me)
                })
            }
        }
    }
})