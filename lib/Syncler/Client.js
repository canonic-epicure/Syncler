Role('Syncler.Client', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler'//, 'KiokuJS.Backend.Role.HTTP'
    ],
    
    
    use     : [
        'Syncler.Replica.Client',
        'KiokuJS.Exception.Network'
    ],
    
    
    methods : {
        
        newReplica : function (args) {
            args        = args || {} 
            args.scope  = this.newScope()
            
            return new Syncler.Replica.Client(args)
        }
    },
    
    
    continued : {
        
        methods : {
            
//            fetchTopic : function (topicID) {
//                
//                var req         = this.getRequest({
//                    method          : 'PUT',
//                    
//                    data            : this.serialize({ topicID : topicID })
//                })
//                
//                
//                req.request(this.getURLfor('topic/fetch')).except(function (e) {
//                    
//                    throw new KiokuJS.Exception.Network({
//                        nativeEx : e
//                    })
//                    
//                }).andThen(function (res) {
//                    
//                    var response = this.deserialize(res.text)
//                    
//                    if (response.error) 
//                        throw this.decodeException(response.error)
//                    else
//                        this.CONTINUE( response.result )
//                }, this)
//            },
//            
//            
//            createTopic : function (topicID, topicPacket) {
//                
//                var req         = this.getRequest({
//                    method          : 'PUT',
//                    
//                    data            : this.serialize({
//                        topicID     : topicID,
//                        packet      : topicPacket
//                    })
//                })
//                
//                
//                req.request(this.getURLfor('topic/create')).except(function (e) {
//                    
//                    throw new KiokuJS.Exception.Network({
//                        nativeEx : e
//                    })
//                    
//                }).andThen(function (res) {
//                    
//                    var response = this.deserialize(res.text)
//                    
//                    if (response.error) 
//                        throw this.decodeException(response.error)
//                    else
//                        this.CONTINUE(response.result)
//                }, this)
//            }
        }
    }
    // eof continued
})

