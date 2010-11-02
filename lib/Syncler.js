Role('Syncler', {
    
    /*VERSION,*/
    
    requires    : [ 'newChannel', 'setupChannel' ],
    
    trait       : 'JooseX.CPS',
    
    
    has : {
        fayeClient              : { 
            is          : 'rw',
            required    : true
        }
    },
    
    
    does    : 'Syncler.PubSub.Faye',
    
    
    continued : {
        
        methods : {
            
            setupChannel : function (config) {
                
                var topic = config.topic
                
                // new topic
                if (topic) {
                    var channel = config.channel || topic.channel
                    
                    channel.establish(topic).now()
                    
                    return
                }

                
                var topicID = config.topicID
                
                // already existing topic
                if (topicID) {
                    var channel     = config.channel || this.newChannel()
                    
                    channel.fecthTopic(topicID).now()
                    
                    return
                }
                
                throw "Incorrect parameters to `setupChannel`"
            }
        }
    }
    
})

