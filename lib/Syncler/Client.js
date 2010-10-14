Role('Syncler.Client', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler',
        'Syncler.PubSub.Faye'
    ],
    
    
    use     : [
        'Syncler.Vero',
        'Syncler.Channel.Client',
        
        {
            token       : 'Syncler/static/deps/faye/faye-browser.js',
            presence    : 'Faye'
        }
    ],
    
    
    has : {
        fayeURL                 : '/faye',
        
        fayeClient              : { is : 'rw' }
    },
    
    
    
    after : {
        
        initialize : function () {
            if (!this.fayeClient) this.fayeClient = new Faye.Client(this.fayeURL)
        }
    },
    

    methods : {
        
        newChannel : function () {
            return new Syncler.Channel.Client({
                syncler     : this,
                scope       : this.newScope()
            })
        }
    },
    
    
    continued : {
        
        methods : {
            
            setupChannel : function (config) {
                
                var topic = config.topic
                
                // new topic
                if (topic) {
                    var channel = topic.channel
                    
                    channel.setTopic(topic)
                    
                    channel.setup().now()
                    
                    return
                }

                
                var topicID = config.topicID
                
                // already existing topic
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

