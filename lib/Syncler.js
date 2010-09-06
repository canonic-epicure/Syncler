Class('Syncler', {
    
    /*VERSION,*/
    
    isa         : 'KiokuJS.Backend',
    
    
    use     : [
        'JSON2',
    
        Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR',
        
        'Syncler.Node',
        
        'KiokuJS.Exception.Format',
        'KiokuJS.Exception.Network',
        'KiokuJS.Exception.LookUp',
        'KiokuJS.Exception.Overwrite', 
        'KiokuJS.Exception.Update',
        'KiokuJS.Exception.Conflict'
    ],
    
    does    : [
//        'JooseX.Observable'
//        'KiokuJS.Backend.Feature.Overwrite', 
//        'KiokuJS.Backend.Feature.Update' 
    ],
    
    
    
    has : {
        baseURL                 : '/syncler',
        
        nodeClass               : Joose.I.FutureClass('Syncler.Node'),
        
        requestProviderClass    : Joose.I.FutureClass(Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR')
    },
    
    
    
    after : {
        
        initialize : function () {
            this.baseURL = this.baseURL.replace(/\/+$/, '')
        }
    },
    
    
        
    methods : {
        
        
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
        }
    },
    
    
    continued : {
        
        methods : {
            
            get     : function (idsToGet, scope, mode) {
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(idsToGet)
                })
                
                
                req.request({
                    
                    url : this.getURLfor('get') 
                
                }, this).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.evalJSON(res.text)
                    
                    if (response.error) 
                        throw new KiokuJS.Exception({ message : res.text })
                    else
                        this.CONTINUE(this.deserializeNodes(response.result))
                })
            },
            
            
            
            insert  : function (nodesToInsert, scope, mode) {
                var entries     = this.serializeNodes(nodesToInsert)
                
                var data        = this.stringifyJSON({
                    entries     : entries,
                    mode        : mode
                })
                
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : data
                })
                
                
                req.request({
                    
                    url : this.getURLfor('insert') 
                
                }, this).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.evalJSON(res.text)
                    
                    if (response.error) 
                        throw new KiokuJS.Exception({ message : res.text })
                    else {
                        
                        var ids = Joose.A.map(response.result, function (insertResult) {
                            
                            if (insertResult === Object(insertResult) && insertResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(insertResult) })
                            
                            return insertResult
                        })
                        
                        this.CONTINUE(ids)
                    }
                })
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
                
                
                req.request({
                    
                    url : this.getURLfor('remove') 
                
                }, this).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.evalJSON(res.text)
                    
                    if (response.error) 
                        throw new KiokuJS.Exception({ message : res.text })
                    else {
                        
                        Joose.A.each(response.result, function (removeResult) {
                            
                            if (removeResult === Object(removeResult) && removeResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(removeResult) })
                        })
                        
                        this.CONTINUE()
                    }
                })
            },
            
            
            exists  : function (idsToCheck) {
                var req         = this.getRequest({
                    method          : 'PUT',
                    
                    data            : this.stringifyJSON(ids)
                })
                
                
                req.request({
                    
                    url : this.getURLfor('exists') 
                
                }, this).except(function (e) {
                    
                    throw new KiokuJS.Exception.Network({
                        nativeEx : e
                    })
                    
                }).andThen(function (res) {
                    
                    var response = this.evalJSON(res.text)
                    
                    if (response.error) 
                        throw new KiokuJS.Exception({ message : res.text })
                    else {
                        
                        var results = Joose.A.each(response.result, function (existsResult) {
                            
                            if (existsResult === Object(existsResult) && existsResult.error) throw new KiokuJS.Exception({ message : JSON.stringify(existsResult) })
                            
                            return existsResult
                        })
                        
                        this.CONTINUE(results)
                    }
                })
            },
            
        
            commit      : function () {
                
            },
            
            
            rollback    : function () {
            }
        }
    }
})