Class('Syncler.ServerApp', {
    
    use         : [
        'Syncler.Server' 
    ],
    
    
    isa         : 'KiokuJS.Backend.Batch.Server',
    
    does        : 'Syncler.PubSub.Faye',
    
    
    has : {
        fayeURL                 : { required : true },
        fayeClient              : { is : 'rw' },
        
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
            var backendParams = this.backendParams = this.backendParams || {}
            
            backendParams.trait = Syncler.Server
            this.fayeClient     = backendParams.fayeClient = bayeux.getClient()
            
            
            this.SUPER()
            
            this.subscribe('/syncler/channel/new', this.onNewChannel, this)
            
            app.put(baseURL + '/topic/get', function (req, res) {
                var topicID = req.body.topicID
                
                me.onGetTopic(topicID).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function (topic) {
                    
                    res.send({
                        result :  me.backend.encodePacket({ topic : topic }, [])
                    })
                })
            })
        },
        
        
        onNewChannel : function (message) {
            var puts        = require('sys').puts
            var me          = this
            var topicID     = message.topicID
            
            
            puts('topicID = ' + topicID)
            
            if (this.channels[ topicID ]) {
                puts('re-using existing channel')
                
                return
            }
            
            var channel = this.channels[ topicID ] = this.backend.newChannel() 
            
            puts('Creating new channel')
            
            this.backend.setupChannel({ topicID : topicID, channel : channel }).then(function (channel) {
                
                var topic = channel.getTopic()
                var scope = channel.scope
                
                puts('channel established')
                puts('Topic rev: ' + scope.objectToNode(topic).REV)
                
                me.setupChannel(channel)
                
            }).except(function (e) {
                
                puts('ERROR = ' + e)
            
            }).now()
        },
        
        
        
        setupChannel : function (channel) {
            var topicID = channel.getTopic().getTopicID()
            
            channel.on('update-idle', this.persistChannel, this)
        },
        
        
        persistChannel : function (channel) {
            channel.saveTopic()
        }
    },
    
    
    continued : {
        
        methods : {
            
            onGetTopic : function (topicID) {
                
                var topicChannel = this.channels[ topicID ]
                
                if (topicChannel) {
                    this.CONTINUE(topicChannel.getTopic())
                    
                    return
                }
                
                this.backend.newScope().lookUp(topicID).now()
            }
        }
    }
})
