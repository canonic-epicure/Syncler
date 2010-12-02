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
        
        Class('Topic', {
            
            does        : Syncler.Topic.UUID,
            
            hasSynced   : {
                
                str         : 'foo-bar',
                num         : 0,
                
                obj         : Syncler.I.Object,
                arr         : Syncler.I.Array
            },
            
            methods : {
            }
        })
        

        //======================================================================================================================================================================================================================================================
        t.diag('Topic instantiation')
        
        var topic   = new Topic({ 
            replica         : replica,
            
            str             : 'bar-baz'
        })
        
        replica.setTopic(topic)
        
        
        var op = replica.commit()
        
        t.isa_ok(op, Syncler.Operation.Auto, 'Correct class for operation')
        
        
        t.ok(op.mutations.length == 6, 'Operation contains 6 mutations')
        
        var mutation1 = op.mutations[0]
        
        t.isa_ok(mutation1, Syncler.Mutation.Class.Create, 'Mutation is an instance creation')
        
        t.ok(mutation1.className == 'Topic', 'First is the creation of the Topic')

        
        //======================================================================================================================================================================================================================================================
        t.diag('Mutations internals')
        
        t.ok(replica.getCount() == 4, '4 objects in scope (1 replica and 1 topic and 2 composite attributes)')
        
        
        var topicID = replica.objectToId(topic)
        
        t.ok(topicID == topic.getTopicID(), 'Topic ID has been used as object ID')
        
        t.ok(replica.idToObject(topicID) == topic, 'Correct object resolved')
        

        //======================================================================================================================================================================================================================================================
        t.diag('Operation unapply')
        
        op.unapply(replica)
        
        t.ok(replica.getCount() == 1, 'No objects in scope (only replica)')
        
        t.ok(op.checkPrecondition(replica), 'Operation can be applied to replica')
        
        //======================================================================================================================================================================================================================================================
        t.diag('Apply operation back')
        
        op.apply(replica)
        
//        debugger
        
        t.ok(replica.getCount() == 4, '4 objects in scope')
        
        
        
        t.done()
    })
    
})