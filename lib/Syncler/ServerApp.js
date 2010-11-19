Class('Syncler.ServerApp', {
    
    use         : [
        'Syncler.Server' 
    ],
    
    
    isa         : 'KiokuJS.Backend.Batch.ServerApp',
    
//    does        : 'Syncler.PubSub.Faye',
    
    
    has : {
        fayeURL                 : { required : true },
//        fayeClient              : { is : 'rw' },
        
        replicas                : Joose.I.Object
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
            
            
            var backendParams = this.backendParams = Joose.O.copy(this.backendParams)
            
            // add Syncler.Server trait to backend instance 
            backendParams.trait         = Syncler.Server
            backendParams.fayeClient    = bayeux.getClient()
            
            this.SUPER()
            
            app.put(this.baseURL + '/topic/fetch', function (req, res) {
                
                var topicID = req.body.topicID
                
                var cont = me.getReplica(topicID).then(function (replica) {
                    
                    var scope = me.backend.newScope()
                    
                    scope.registerProxy(replica, 'replica:' + replica.getTopic().getTopicID())
                    
                    this.CONTINUE(scope.includeNewObjects({}, [ replica.getTopic() ]))
                })
                
                me.send(cont, res)
            })
            
            
            app.put(this.baseURL + '/topic/create', function (req, res) {
                
                require('util').puts('TOPIC CREATE REACHED')
                
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
                var replicas    = this.replicas
                
                var replica     = backend.newReplica()
                var topicID     = dataPacket.topicID
                
                if (replicas[ topicID ]) throw "Can't create topic [" + topicID + "] - replica already exists"
                
                
                replica.setup({ dataPacket : dataPacket }).andThen(function (replica) {
                    
                    if (replicas[ topicID ]) throw "Can't create topic [" + topicID + "] - replica already exists"
                    
                    replicas[ topicID ] = replica
                    
                    console.log('NEW TOPIC SUCCESSFULLY CREATED: ' + topicID)
                    
                    this.CONTINUE(replica.getTopic())
                })
            },

            
            getReplica : function (topicID) {
                var me          = this
                var replica     = this.replicas[ topicID ]
                
                // replica already exists
                if (replica) {
                    
                    replica.onReady(this.getCONTINUE())
                    
                    return
                }
                
                // create new replica
                var replica = this.replicas[ topicID ] = this.backend.newReplica() 
                
                replica.setup({ topicID : topicID }).now()
            }
        }
    }
})
