StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Backend.Hash', 'Syncler.Client', 'Syncler.Topic' ], function () {
        
        t.endAsync(async0)
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
        t.ok(Syncler.Replica, "Syncler.Client is here")
        t.ok(Syncler.Topic, "Syncler.Topic is here")
        t.ok(Syncler.I.Object, "Syncler.I.Object is here")
        
        
        
        
        var backend = new KiokuJS.Backend.Hash({
            trait   : [ Syncler.Client ]
        })
        
        var replica = backend.newReplica()
        
        Class('Topic', {
            
            does        : Syncler.Topic,
            
            hasSynced   : {
                
                str         : 'foo-bar',
                num         : 0,
                smth        : Syncler.I.Object
            },
            
            methods : {
                
                getTopicID : function () {
                    return 1
                }
            }
        })
        
        var topic   = new Topic({ 
            replica         : replica,
            
            str             : 'bar-baz',
            smth            : {}
        })
        
        var op = replica.commit()
        
        t.isa_ok(op, Syncler.Operation.Auto, 'Correct class for operation')
        
        t.ok(op.mutations.length == 1, 'Operation contains single mutation')
        
        var mutation = op.mutations[0]
        
        t.isa_ok(mutation, Syncler.Mutation.Class.Create, 'Operation is an instance creation')
        
        t.done()
    })
    
})