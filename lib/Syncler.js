Role('Syncler', {
    
    /*VERSION,*/
    
    
    does    : [
        'KiokuJS.Backend.Batch',
        'Syncler.PubSub.Faye'
    ],
    
    
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
        
        fayeClient              : { is : 'rw' }
    },
    
    
    
    after : {
        
        initialize : function () {
            if (!this.fayeClient) this.fayeClient = new Faye.Client(this.fayeURL)
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

