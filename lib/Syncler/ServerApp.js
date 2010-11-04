Class('Syncler.ServerApp', {
    
    use         : [
        'Syncler.Server' 
    ],
    
    
    isa         : 'KiokuJS.Backend.Batch.ServerApp',
    
//    does        : 'Syncler.PubSub.Faye',
    
    
    has : {
        fayeURL                 : { required : true },
//        fayeClient              : { is : 'rw' },
        
        channels                : Joose.I.Object
    },
    

    methods : {
        
        initialize : function () {
            // initialize Faye
            var app         = this.app
            var me          = this
            
            var bayeux = new faye.NodeAdapter({
                mount       : this.fayeURL,
                timeout     : 45
            })

            bayeux.attach(app)
            
            
            // initialize backend instance with Syncler
            var backendParams = this.backendParams = Joose.O.copy(this.backendParams)
            
            backendParams.trait         = Syncler.Server
            backendParams.fayeClient    = bayeux.getClient()
//            this.fayeClient     =
            
            
            this.SUPER()
            
            app.put(this.baseURL + '/topic/fetch', function (req, res) {
                
                var topicID = req.body.topicID
                
                var cont = me.getChannel(topicID).then(function (channel) {
                    
                    this.CONTINUE(me.backend.encodePacket({ topic : channel.getTopic() }, []))
                })
                
                me.send(cont, res)
            })
            
            
            app.put(this.baseURL + '/topic/create', function (req, res) {
                
                var cont = me.createTopic(req.body).then(function (topic) {
                    
                    this.CONTINUE({ topicID : topic.getTopicID() })
                })
                
                me.send(cont, res)
            })
        }
    },
    
    
    continued : {
        
        methods : {
            
            createTopic : function (dataPacket) {
                
                var backend     = this.backend
                var channels    = this.channels
                
                var channel     = backend.newChannel()
                var topicID     = dataPacket.topicID
                
                if (channels[ topicID ]) throw "Can't create topic [" + topicID + "] - channel already exists"
                
                
                channel.setup({ dataPacket : dataPacket }).andThen(function (channel) {
                    
                    if (channels[ topicID ]) throw "Can't create topic [" + topicID + "] - channel already exists"
                    
                    channels[ topicID ] = channel
                    
                    this.CONTINUE(channel.getTopic())
                })
            },

            
            getChannel : function (topicID) {
                var me          = this
                var channel     = this.channels[ topicID ]
                
                // channel already exists
                if (channel) {
                    
                    channel.onReady(this.getCONTINUE())
                    
                    return
                }
                
                // create new channel
                var channel = this.channels[ topicID ] = this.backend.newChannel() 
                
                channel.setup({ topicID : topicID }).now()
            }
        }
    }
})
