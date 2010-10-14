Role('Syncler.Server', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler',
        'Syncler.PubSub.Faye'
    ],
    
    
    use     : [
        'Syncler.Vero',
        'Syncler.Channel.Server'
    ],
    
    
    has : {
        fayeURL                 : '/faye',
        
        fayeClient              : { is : 'rw' }
    },
    
    

    methods : {
        
        newChannel : function () {
            return new Syncler.Channel.Server({
                syncler     : this,
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

