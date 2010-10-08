Role('Syncler', {
    
    /*VERSION,*/
    
    
    does    : 'KiokuJS.Backend.Batch',
    
    
    use     : [
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
        
        fayeClient              : null,
        
        uuid                    : Joose.I.UUID
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
        },
        
        
        // XXX cleanup all subscriptions
        subscribe : function (channel, func, scope) {
            var me = this
            
            this.fayeClient.subscribe(channel, function (wrapper) {
                
                console.log('sender uuid: ' + wrapper.sender + ' receiver uuid: ' + me.uuid)
                
                if (wrapper.sender == me.uuid) return
                
                func.call(scope || me, wrapper.message)
            })
        },
        
        
        publish : function (channel, message) {
            
            var wrapper = {
                sender  : this.uuid,
                
                message : message
            }
            
            this.fayeClient.publish(channel, wrapper)
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

