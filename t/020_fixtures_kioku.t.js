StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(KiokuJS.Test, "KiokuJS.Test is here")
    t.ok(KiokuJS.Backend.Batch, "KiokuJS.Backend.Batch is here")
    t.ok(Syncler.Client, "Syncler.Client is here")
    
    
    t.harness.currentPort   = t.harness.currentPort || 9000
    
    new KiokuJS.Test({
        t       : t,
        
//        fixtures    : [ 'StressLoad.Tree' ],
//        fixtures    : [ 'Remove' ],
        
        connect : function () {
            
            var port    = t.harness.currentPort++
            
            HTTP.Request.Provider.getRequest({ 
                
                headers : { 'content-type' : 'application/json' },
                
                url     : '/8080/start_test', 
                method  : 'PUT',
                
                data    : JSON2.stringify({ 
                    port            : port,
                    fayeURL         : '/faye',
                    
                    backendClass    : 'KiokuJS.Backend.Hash'
                })
                
            }).andThen(function () {
                
                var backend = new KiokuJS.Backend.Hash({
                    trait   : [ Syncler.Client, KiokuJS.Backend.Batch ],
                    
                    baseURL : '/' + port,
                    
                    fayeClient  : {}
                })
                
                backend.__port__ = port
                
                this.CONTINUE(backend)
            })
        },
        
        cleanup : function (backend, t) {
            
            HTTP.Request.Provider.getRequest({ 
                
                headers : { 'content-type' : 'application/json' },
                
                url     : '/8080/finish_test', 
                method  : 'PUT',
                
                data    : JSON2.stringify({ 
                    port : backend.__port__ 
                })
                
            }).now()
        }
        
    }).runAllFixtures().andThen(function () {
        
        t.endAsync(async0)
        
        t.done()
    })
})    
