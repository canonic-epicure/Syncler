Class('Syncler.ServerApp', {
    
    use         : [
        'Syncler.Server' 
    ],
    
    
    isa         : 'KiokuJS.Backend.Batch.ServerApp',
    
    
    has : {
        socketListener          : { required : true },
        
        replicas                : Joose.I.Object
    },
    

    methods : {
        
        initialize : function () {
            // initialize Faye
            var app         = this.app
            var me          = this
            
            
            var backendParams = this.backendParams// = Joose.O.copy(this.backendParams)
            
            // add Syncler.Server trait to backend instance 
            backendParams.trait         = Syncler.Server
            
            this.SUPER()
            
            
            var socketListener = this.socketListener
            
            socketListener.on('connection', function (client) {
                
                client.on('message', function (message) {
                    
                    if (message.type == 'fetchTopic') {
                        
                        TRY(me).getReplica(message.topicID).then(function (replica) {
                            
                            replica.joinClient(client)
                        })
                    }
                    
                    
                    if (message.type == 'createTopic') {
                        
                        TRY(me).createTopic(message.topicPacket).then(function (topic, replica) {
                            
                            replica.joinTopicCreator(client)
                        })
                        
                        
                        TRY(me).getReplica(topicID).then(function (replica) {
                            
                            replica.joinNewClient(client)
                        })
                    }
                })
                
                
                client.on('disconnect', function () {
                    
                    console.log('disconnected')
                }) 
            })
            
            
            app.put(this.baseURL + '/topic/fetch', function (req, res) {
                
                var topicID = req.body.topicID
                
                
                me.send(cont, res)
            })
            
            
            app.put(this.baseURL + '/topic/create', function (req, res) {
                
                require('util').puts('TOPIC CREATE REACHED')
                
                
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
                    
                    this.CONTINUE(replica.getTopic(), replica)
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
