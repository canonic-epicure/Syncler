Class('Syncler.Server', {
    
    trait       : 'JooseX.CPS',
    
    has : {
        backendClass            : null,
        backendParams           : null,
        
        backend                 : null,
        
        baseURL                 : null,
        
        app                     : { required : true }
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
                    
                }).andThen(function (ids) {
                    
                    res.send({
                        result : ids
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
        },
        
    
        encodeException : function (e) {
            return this.backend.encodeObjects({ error : e }, [])
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
