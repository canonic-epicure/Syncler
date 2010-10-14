Role('Syncler.Server', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler'
    ],
    
    
    use     : [
        'Syncler.Channel.Server'
    ],
    
    

    methods : {
        
        newChannel : function () {
            return new Syncler.Channel.Server({
                fayeClient  : this.fayeClient,
                scope       : this.newScope()
            })
        }
    },
    
    
    continued : {
        
        methods : {
            
            setupChannel : function (config) {
                
                var topic = config.topic
                
                if (topic) {
                    var channel = topic.channel
                    
                    channel.setTopic(topic)
                    
                    channel.setup().now()
                    
                    return
                }

                
                var topicID = config.topicID
                
                if (topicID) {
                    var channel     = this.newChannel()
                    var scope       = channel.scope
                    
                    scope.registerProxy(channel, 'channel:' + topicID)
                    
                    channel.setup({ topicID : topicID }).now()
                    
                    return
                }
                
                throw "Incorrect parameters to `setupChannel`"
            }
        }
    }
    // eof continued
})

