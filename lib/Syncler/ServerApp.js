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
            var backendParams           = this.backendParams// = Joose.O.copy(this.backendParams)
            backendParams.trait         = [ Syncler.Server ].concat(backendParams.trait || [], backendParams.traits || [])
            
            this.SUPER()
            
            var me          = this
            
            this.socketListener.on('connection', function (client) {
                
                me.onNewClient(client)    
            })
        },
        
        
        onNewClient : function (client) {
            var me          = this
            
            var onNewMessage = function (message) {
                
                if (message.type == 'createReplica')
                
                    TRY(me).createReplica(message.topicID, message.topicPacket).THEN(function (replica) {
                        
                        replica.joinTopicCreator(client)
                        
                        this.CONTINUE()
                        
                    }).FINALLY(function () {
                        
                        client.un('message', onNewMessage)
                        
                    }).now()
                
                
                if (message.type == 'fetchReplica') {
                    
                    TRY(me).getReplica(message.topicID).THEN(function (replica) {
                        
                        replica.joinNewClient(client)
                        
                    }).FINALLY(function () {
                        
                        client.un('message', onNewMessage)
                        
                    }).now()
                }
            }
            
            client.on('message', onNewMessage)
        }
    },
    
    
    continued : {
        
        methods : {
            
            createReplica : function (topicID, topicPacket) {
                
                var backend     = this.backend
                var replicas    = this.replicas
                var replica     = backend.newReplica()
                
                if (replicas[ topicID ]) throw "Can't create topic [" + topicID + "] - replica already exists"
                
                
                replica.setup({ topicID : topicID, topicPacket : topicPacket }).andThen(function (replica) {
                    
                    if (replicas[ topicID ]) throw "Can't create topic [" + topicID + "] - replica already exists"
                    
                    replicas[ topicID ] = replica
                    
                    console.log('NEW REPLICA SUCCESSFULLY CREATED: ' + topicID)
                    
                    this.CONTINUE(replica)
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
