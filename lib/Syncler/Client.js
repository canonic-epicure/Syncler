Role('Syncler.Client', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler'
    ],
    
    
    use     : [
        'Syncler.Channel.Client'
    ],
    
    
    methods : {
        
        newChannel : function () {
            return new Syncler.Channel.Client({
                fayeClient  : this.fayeClient,
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
                    
                    channel.establish(topic).now()
                    
                    return
                }

                
                var topicID = config.topicID
                
                // already existing topic
                if (topicID) {
                    var channel     = this.newChannel()
                    
                    channel.fecthTopic(topicID).now()
                    
                    return
                }
                
                throw "Incorrect parameters to `setupChannel`"
            },
            
            
            fetchTopic : function (topicID) {
            }
        }
    }
    // eof continued
})

