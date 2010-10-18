Role('Syncler.Client', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope', 'getRequest', 'getURLfor' ],
    
    
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
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : data
                })
                
                
                req.request(this.getURLfor('/topic/fetch')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.deserialize(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else
                        this.CONTINUE(this.decodePacket(response.result))
                }, this)
            }
        }
    }
    // eof continued
})

