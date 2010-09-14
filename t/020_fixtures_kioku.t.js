StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Test, "KiokuJS.Test is here")
    t.ok(KiokuJS.Backend.CouchDB, "KiokuJS.Backend.CouchDB is here")
    t.ok(Syncler, "Syncler is here")
    

    var portCounter     = t.harness.currentPort = t.harness.currentPort || 9000
    var request         = HTTP.Request.Provider.request
    
    new KiokuJS.Test({
        t       : t,
        
//        fixtures    : [ 'StressLoad.Tree' ],
        
        connect : function () {
            
            var dbURL   = 'http://local/5984/kiokujs-backend-couchdb-' + new Date().getTime()
            var port    = t.harness.currentPort++
            
            request({ 
                
                headers : { 'content-type' : 'application/json' },
                
                url     : 'http://local/8080/start_test', 
                method  : 'PUT',
                
                data    : JSON2.stringify({ dbURL : dbURL, port : port })
                
            }).andThen(function (res) {
                
                var backend = new Syncler({
                    baseURL     : 'http://local/' + port,
                    dbURL       : dbURL
                })
                
                backend.__dbURL__ = dbURL
                
                this.CONTINUE(KiokuJS.connect({
                    backend : backend
                }))
            })
        },
        
        cleanup : function (handle, t) {
            
            request({ 
                
                headers : { 'content-type' : 'application/json' },
                
                url     : 'http://local/8080/finish_test', 
                method  : 'PUT',
                
                data    : JSON2.stringify({ dbURL : handle.backend.__dbURL__ })
                
            }).now()
        }
        
    }).runAllFixtures().andThen(function () {
        
        t.endAsync(async0)
        
        t.done()
    })
})    
