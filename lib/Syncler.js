Role('Syncler', {
    
    /*VERSION,*/
    
    
    does    : [
        'KiokuJS.Backend.Batch',
        'Syncler.PubSub.Faye'
    ],
    
    
    use     : [
        'Data.UUID',
        
        'Syncler.Vero',
        'Syncler.Channel',
        
        {
            token       : 'Syncler/static/deps/faye/faye-browser.js',
            presence    : '(Faye || faye)'
        }
    ],
    
    
    has : {
        baseURL                 : '/syncler',
        fayeURL                 : '/faye',
        
        fayeClient              : { is : 'rw' },
        
        uuid                    : function () { return Data.UUID.uuid() }
    },
    
    
    
    after : {
        
        initialize : function () {
            this.baseURL = this.baseURL.replace(/\/+$/, '')
            
            if (!this.fayeClient) this.fayeClient = new Faye.Client(this.fayeURL)
            
            
//            this.fayeClient.addExtension({
//                
//                incoming: function (message, callback) {
//                    
//                    console.log('incoming', JSON2.stringify(message))
//                    
//                    callback(message)
//                },
//                
//                
//                outgoing: function (message, callback) {
//                    
//                    console.log('outgoing', JSON2.stringify(message))
//                    
//                    callback(message)
//                }
//            })
        }
    },
    

    methods : {
        
        createChannel : function () {
            return new Syncler.Channel({
                syncler     : this,
                scope       : this.newScope()
            })
        }
    },
    
    
    continued : {
        
        methods : {
            
            establishChannel : function (topicID, fromServer) {
                var scope       = this.newScope()
                
                var channel     = new Syncler.Channel({
                    syncler         : this,
                    scope           : scope
                })
                
                
                scope.registerProxy(channel, 'channel:' + topicID)
                
                scope.lookUp(topicID).andThen(function (topic) {
                    
                    channel.setTopic(topic)
                    
                    channel.subscribeOnUpdates()
                    
                    if (!fromServer) channel.publish('/vero/channel/new', { topicID : topicID })
                    
                    this.CONTINUE(channel)
                })
            }

        }
    }
})

