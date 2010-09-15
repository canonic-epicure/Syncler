Class('Syncler', {
    
    /*VERSION,*/
    
    isa         : 'KiokuJS.Backend',
    
    
    use     : [
        'JSON2',
    
        Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR',
        
        'KiokuJS.Backend.CouchDB.Node',
        
        'Syncler.Vero',
        'Syncler.Node',
        
        'Syncler.Channel',
        
        'KiokuJS.Exception.Format',
        'KiokuJS.Exception.Network',
        'KiokuJS.Exception.LookUp',
        'KiokuJS.Exception.Overwrite', 
        'KiokuJS.Exception.Update',
        'KiokuJS.Exception.Conflict',
        
        {
            token       : 'Syncler/static/deps/faye/faye-browser.js',
            presence    : '(Faye || faye)'
        }
    ],
    
    does    : [
//        'JooseX.Observable'
        'KiokuJS.Backend.Feature.Overwrite', 
        'KiokuJS.Backend.Feature.Update' 
    ],
    
    
    
    has : {
        fayeURL                 : '/faye',
        baseURL                 : '/',
        
        fayeClient              : null,
        
        nodeClass               : Joose.I.FutureClass('Syncler.Node'),
        
        requestProviderClass    : Joose.I.FutureClass(Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR'),
        
        uuid                    : Joose.I.UUID
    },
    
    
    
    after : {
        
        initialize : function () {
            this.baseURL = this.baseURL.replace(/\/+$/, '')
            
            if (!this.fayeClient) this.fayeClient = new Faye.Client(this.fayeURL)
            
            
            this.fayeClient.addExtension({
                
                incoming: function (message, callback) {
                    
                    console.log('incoming', JSON2.stringify(message))
                    
                    callback(message)
                },
                
                
                outgoing: function (message, callback) {
                    
                    console.log('outgoing', JSON2.stringify(message))
                    
                    callback(message)
                }
            })
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
        },

        
        getRequest : function (config) {
            config.headers = {
                'content-type' : 'application/json'
            }
            
            return new this.requestProviderClass(config)
        },
        
        
        getURLfor : function (action) {
            return this.baseURL + '/' + action 
        },
        
        
        stringifyJSON : function (data) {
            try {
                return JSON2.stringify(data)
            } catch (e) {
                throw new KiokuJS.Exception.Format({ message : 'Invalid JSON: ' + data })
            }
        },
        
        
        parseJSON : function (str) {
            try {
                return JSON2.parse(str)
            } catch (e) {
                throw new KiokuJS.Exception.Format({ message : 'Invalid JSON: ' + str })
            }
        },
        
        
        decodeException : function (packet) {
            return this.decodeObjects(packet)[ 0 ].error
        }
    },
    
    
    continued : {
        
        methods : {
            
            establishChannel : function (topicID) {
                var scope       = this.newScope()
                
                var channel     = new Syncler.Channel({
                    syncler         : this,
                    scope           : scope
                })
                
                
                scope.registerProxy(channel, 'channel:' + topicID)
                
                scope.lookUp(topicID).andThen(function (topic) {
                    
                    channel.setTopic(topic)
                    
                    channel.subscribeOnUpdates()
                    
                    this.CONTINUE(channel)
                })
            },
            
            
//            createDB : function () {
//                
//                this.getRequest({
//                    method          : 'PUT',
//                    
//                    data            : this.stringifyJSON({ url : this.dbURL }),
//                    
//                    url             : this.getURLfor('createdb')
//                }).now()
//            },
//            
//            
//            deleteDB : function () {
//                
//                this.getRequest({
//                    method          : 'PUT',
//                    
//                    data            : this.stringifyJSON({ url : this.dbURL }),
//                    
//                    url             : this.getURLfor('deletedb')
//                }).now()
//            },
            
            
            get     : function (idsToGet, scope, mode) {
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(idsToGet)
                })
                
                
                req.request(this.getURLfor('get')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else
                        this.CONTINUE(this.decodeEntries(response.result))
                }, this)
            },
            
            
            
            insert  : function (nodesToInsert, scope, mode) {
                var entries     = this.encodeNodes(nodesToInsert)
                
                var data        = this.stringifyJSON({
                    entries     : entries,
                    
                    mode        : mode
                })
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : data
                })
                
                var nodesByID   = {}
                
                Joose.A.each(nodesToInsert, function (node) {
                    nodesByID[ node.ID ] = node
                })
                
                req.request(this.getURLfor('insert')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else {
                        
                        var ids = Joose.A.map(response.result, function (insertResult) {
                            
                            if (insertResult === Object(insertResult) && insertResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(insertResult) })
                            
                            var id      = insertResult[0]
                            var rev     = insertResult[1]
                            
                            nodesByID[ id ].REV = rev
                            
                            return id
                        })
                        
                        this.CONTINUE(ids)
                    }
                }, this)
            },
            
            
            remove  : function (nodesOrIds) {
                var ids = Joose.A.map(nodesOrIds, function (nodeOrID) {
                    
                    if (nodeOrID instanceof KiokuJS.Node) return nodeOrID.ID
                    
                    return nodeOrID
                })
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(ids)
                })
                
                
                req.request(this.getURLfor('remove')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else {
                        
                        Joose.A.each(response.result, function (removeResult) {
                            
                            if (removeResult === Object(removeResult) && removeResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(removeResult) })
                        })
                        
                        this.CONTINUE()
                    }
                }, this)
            },
            
            
            exists  : function (idsToCheck) {
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(ids)
                })
                
                
                req.request(this.getURLfor('exists')).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.parseJSON(res.text)
                    
                    if (response.error) 
                        throw this.decodeException(response.error)
                    else {
                        
                        var results = Joose.A.each(response.result, function (existsResult) {
                            
                            if (existsResult === Object(existsResult) && existsResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(existsResult) })
                            
                            return existsResult
                        })
                        
                        this.CONTINUE(results)
                    }
                }, this)
            }
        }
    }
})

