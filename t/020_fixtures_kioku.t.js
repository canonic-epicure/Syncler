StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Test, "KiokuJS.Test is here")
    t.ok(KiokuJS.Backend.CouchDB, "KiokuJS.Backend.CouchDB is here")
    t.ok(Syncler, "Syncler is here")
    

    
    new KiokuJS.Test({
        t       : t,
        
//        fixtures    : [ 'StressLoad.Tree' ],
        
        connect : function () {
            
            var backend = new Syncler({
                baseURL     : 'http://local/8080/',
                dbURL       : 'http://local/5984/kiokujs-backend-couchdb-' + new Date().getTime()
            })

            
            backend.createDB().andThen(function () {
                
                this.CONTINUE(KiokuJS.connect({
                    backend : backend
                }))
            })
        },
        
        cleanup : function (handle, t) {
            handle.backend.deleteDB().now()
        }
        
    }).runAllFixtures().andThen(function () {
        
        t.endAsync(async0)
        
        t.done()
    })
})    
