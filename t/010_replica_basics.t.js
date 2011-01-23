StartTest(function(t) {
    
    var async0 = t.beginAsync()
    
    use([ 'KiokuJS.Backend.Hash', 'Syncler.Client', 'Syncler.Topic.UUID' ], function () {
        
        t.endAsync(async0)
        
        //======================================================================================================================================================================================================================================================
        t.diag('Sanity')
        
        t.ok(KiokuJS.Backend.Hash, "KiokuJS.Backend.Hash is here")
        t.ok(Syncler.Replica, "Syncler.Client is here")
        t.ok(Syncler.Topic.UUID, "Syncler.Topic.UUID is here")
        t.ok(Syncler.I.Object, "Syncler.I.Object is here")
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Setup')
        
        var backend = new KiokuJS.Backend.Hash({
            trait   : [ Syncler.Client ]
        })
        
        var replica = backend.newReplica()
        
        //======================================================================================================================================================================================================================================================
        t.diag('Instantiation in replica')
        
        var syncedObject    = new Syncler.Composite.Object({
            replica : replica
        })

        t.ok(replica.tentativeQueue.length == 1, 'Replica contains 1 mutations')
        
        var mutation = replica.tentativeQueue[0]
        
        
        t.isa_ok(mutation, Syncler.Mutation.Class.Create, 'First mutation is an instance creation')
        
        t.ok(mutation.className == 'Syncler.Composite.Object', 'And its creation of `Syncler.Composite.Object` (for topic initialization)')

        
        //======================================================================================================================================================================================================================================================
        t.diag('Replica internals')
        
        t.ok(replica.getCount() == 1, '1 objects in scope')
        
        
        var objID = replica.objectToId(syncedObject)
        
        t.ok(replica.idToObject(objID) == syncedObject, 'Correct round-trip for resolution by ID')
        

        //======================================================================================================================================================================================================================================================
        t.diag('Undo/redo')
        
        replica.undoTentative()
        
        t.ok(replica.getCount() == 0, 'No objects in scope (only proxy for replica)')
        
        replica.redoTentative()
        
        t.ok(replica.getCount() == 1, '2 objects in scope again')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('References after `redo`')
        
        t.ok(syncedObject == replica.idToObject(objID), 'And its the same object (to keep the references)')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('getInheritanceChainOf')
        
        Class('Topic', {
            
            does        : Syncler.Topic.UUID,
            
            has         : {
                
                str         : 'foo-bar',
                num         : 0,
                
                obj         : Syncler.I.Object,
                arr         : Syncler.I.Array
            },
            
            methods : {
            }
        })
        
        
        t.isDeeply(replica.getInheritanceChainOf(Topic), [ 'Topic' ], 'Correct result for `getInheritanceChainOf`')
        
        Class('SubTopic', {
            isa     : Topic
        })
        
        t.isDeeply(replica.getInheritanceChainOf(SubTopic), [ 'Topic', 'SubTopic' ], 'Correct result for `getInheritanceChainOf`')
        
        
        t.done()
    })
    
})