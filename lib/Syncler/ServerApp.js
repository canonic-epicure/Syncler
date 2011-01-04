Class('Syncler.ServerApp', {
    
    use         : [
        'Syncler.Server' 
    ],
    
    
    isa         : 'KiokuJS.Backend.Batch.ServerApp',
    
    
    has : {
        socketListener          : { required : true },
        
        replicas                : Joose.I.Object,
        
        persistLog              : true
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
                var clientID    = message.clientID
                
                console.log('NEW CLIENT: ' + clientID)
                
                client.removeListener('message', onNewMessage)
                
                if (message.type == 'createReplica') {
                
                    TRY(me).createReplica(message.topicID, message.topicPacket).then(function (replica) {
                        
                        replica.joinClient(client, clientID)
                        
                        console.log('REPLICA CREATED: ' + clientID)
                        
                        client.send({
                            type        : 'createReplica-result',
                            result      : true
                        })
                        
                        this.CONT.CONTINUE()
                        
                    }).except(function (e) {
                        
                        client.send({
                            type        : 'createReplica-result',
                            error       : e + '',
                            stack       : e.stack
                        })
                        
                        this.CONT.CONTINUE()
                        
                    }).now()
                    
                    return
                }
                
                
                if (message.type == 'fetchReplica') {
                    
                    // `getReplica` will be synchronous for already existing replicas 
                    // so no race conditions should arise
                    TRY(me).getReplica(message.topicID).then(function (replica) {
                        
                        console.log('REPLICA FETCHED: ' + clientID)
                        
                        // let replica know about new client
                        replica.joinClient(client, clientID)
                        
                        // essentially "full db trasfer" to client
                        var scope = me.backend.newScope()
                        
                        scope.registerProxy(replica, 'replica:' + replica.getTopicID())
                        
                        // we need to transfer a) the topic b) the `objectsByID` cache of the replica
                        // the latter cache will contain the objects, which were created but not yet
                        // included in the topic's graph
                        // XXX do not create an extra wrapping object, send only the objects from cache
                        client.send({
                            type        : 'fetchReplica-result',
                            topicPacket : scope.includeNewObjects({}, [ replica.getTopic(), replica.objectsByID ])
                        })
                        
                        this.CONT.CONTINUE()
                        
                    }).except(function (e) {
                        
                        client.send({
                            type        : 'fetchReplica-result',
                            error       : e + '',
                            stack       : e.stack
                        })
                        
                        this.CONT.CONTINUE()
                        
                    }).now()
                    
                    return
                }
                
                throw "Incorrect first message " +  JSON2.stringify(message) + " from client [" + clientID + "]"
            }
            
            client.on('message', onNewMessage)
        }
    },
    
    
    continued : {
        
        methods : {
            
            createReplica : function (topicID, topicPacket) {
                
                var replicas    = this.replicas
                
                var replica     = this.backend.newReplica({
                    persistLog  : this.persistLog
                })
                
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
                var replica = this.replicas[ topicID ] = this.backend.newReplica({
                    persistLog  : this.persistLog
                }) 
                
                replica.setup({ topicID : topicID }).now()
            }
        }
    }
})
