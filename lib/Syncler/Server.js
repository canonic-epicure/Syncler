Class('Syncler.Server', {
    
    use         : [ 'Syncler' ],
    
    trait       : 'JooseX.CPS',
    
    has : {
        backendClass            : null,
        backendParams           : null,
        
        backend                 : null,
        
        baseURL                 : null,
        port                    : null,
        
        fayeClient              : { required : true },
        
        app                     : { required : true },
        
        uuid                    : Joose.I.UUID,
        
        channels                : Joose.I.Object
    },
    

    methods : {
        
        initialize : function () {
            this.backend    = new this.backendClass(this.backendParams)
            
            var app         = this.app
            var baseURL     = this.baseURL
            
            var me          = this
            
            app.put(baseURL + '/get', function (req, res) {
                var ids = req.body
                
                me.onGet(ids).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function (entries) {
                    
                    res.send({
                        result : entries
                    })
                })
            })
            
            
            app.put(baseURL + '/insert', function (req, res) {
                var data = req.body
                
                me.onInsert(data.entries, data.mode).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function (idsAndRevs) {
                    
                    res.send({
                        result : idsAndRevs
                    })
                })
            })
            
            
            app.put(baseURL + '/remove', function (req, res) {
                var ids = req.body
                
                me.onRemove(ids).except(function (e) {
                    
                    res.send({
                        error : e
                    })
                    
                }).andThen(function () {
                    
                    res.send({
                        result : []
                    })
                })
            })
            
            
            app.put(baseURL + '/exists', function (req, res) {
                var ids = req.body
                
                me.onExists(ids).except(function (e) {
                    
                    res.send({
                        error : me.encodeException(e)
                    })
                    
                }).andThen(function (existsResults) {
                    
                    res.send({
                        result : existsResults
                    })
                })
            })
            
            
//            app.put(baseURL + '/commit', function (req, res) {
//                var data = req.body
//                
//                me.onCommit(data).except(function (e) {
//                    
//                    res.send({
//                        error : me.encodeException(e)
//                    })
//                    
//                }).andThen(function (commitRes) {
//                    
//                    res.send({
//                        result : commitRes
//                    })
//                })
//            })
            
            this.subscribe('/vero/channel/new', this.onNewChannel, this)
        },
        
        
        
        onNewChannel : function (message) {
            var me      = this
            
            var topicID = message.topicID
            
            var sys     = require('sys')
            var puts    = sys.puts
            
            if (this.channels[ topicID ]) {
                puts('re-using existing channel')
                
                return
            }
            
            puts('creating new channel, baseURL = ' + 'http://local/' + this.port)
            
            var syncler = new Syncler({
                baseURL         : 'http://local/' + this.port,
                fayeClient      : this.fayeClient
            })
            
            puts('syncler created')
            
            puts('topicID = ' + topicID)
            
            syncler.establishChannel(topicID, true).then(function (channel) {
                
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
            
            this.channels[ topicID ] = channel
            
            channel.on('update', this.persistChannel, this)
        },
        
        
        persistChannel : function (channel) {
            
            channel.saveTopic()
            
//            
//            
//            console.log('Saving topic of the channel')
//
//            var sys     = require('sys')
//            var puts    = sys.puts
//            
//            var topic = channel.getTopic()
//            var scope = channel.scope
//                
//            puts('Topic rev: ' + scope.objectToNode(topic).REV)
//            
//            debugger
//            
//            channel.scope.store(channel.getTopic()).except(function (e) {
//                
//                debugger
//                
//                console.log('Error during saving topic: ' + e)
//                
//            }).then(function () {
//                
//                console.log('Saved topic successfully')
//                
//                puts('Topic rev: ' + scope.objectToNode(topic).REV)
//                
//            }).now()
        },
        
    
        encodeException : function (e) {
            return this.backend.encodeObjects({ error : e }, [])
        },
        
        
        subscribe : function (channel, func, scope) {
            var me = this
            
            this.fayeClient.subscribe(channel, function (wrapper) {
                
                if (wrapper.sender == me.uuid) return
                
                func.call(scope || me, wrapper.message)
            })
        },
        
        
        publish : function (channel, message) {
            
            console.log('PUBLISH FROM SERVER')
            
            var wrapper = {
                sender  : this.uuid,
                
                message : message
            }
            
            this.fayeClient.publish(channel, wrapper)
        }
    },
    
    
    continued : {
        
        methods : {
        
            onGet : function (ids) {
                var backend = this.backend
                
                backend.get(ids, null, null, true).andThen(function (entries) {
                    
                    var jsonEntries = Joose.A.map(entries, backend.serializer.deserialize, backend.serializer)
                    
                    this.CONTINUE(jsonEntries)
                })
            },
            
            
            onInsert : function (entries, mode) {
                var backend = this.backend
                
                backend.insert(entries, null, mode, true).now()
            },
            
            
            onRemove : function (ids) {
                var backend = this.backend
                
                backend.remove(ids).now()
            },
            
            
            onExists : function (ids) {
                var backend = this.backend
                
                backend.exists(ids).now()
            },
            
            
            onCommit : function () {
                this.CONTINUE()
            }
        }
    }
})
