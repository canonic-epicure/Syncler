Role('Syncler.Client', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler', 'KiokuJS.Backend.Role.HTTP'
    ],
    
    
    use     : [
        'Syncler.Channel.Client',
        'KiokuJS.Exception.Network'
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
            
            fetchTopic : function (topicID) {
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : { topicID : topicID }
                })
                
                
                req.request(this.getURLfor('topic/fetch')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.deserialize(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else
                        this.CONTINUE( this.decodePacket(response.result)[0].topic )
                }, this)
            },
            
            
            createTopic : function (topic) {
                
                var scope       = this.newScope()
                
                scope.registerProxy(topic.channel, 'channel:' + topic.getTopicID())
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.serialize({
                        topicID     : topic.getTopicID(),
                        packet      : scope.includeNewObjects({ topic : topic }, [])
                    })
                })
                
                
                req.request(this.getURLfor('topic/create')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.deserialize(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else
                        this.CONTINUE(response.result)
                }, this)
            }
        }
    }
    // eof continued
})

