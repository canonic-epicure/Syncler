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
            
            has         : {
                
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
        
        
        t.ok(replica.tentativeQueue.length == 4, 'Replica contains 3 mutations')
        
        var mutation = replica.tentativeQueue[0]
        
        
        t.isa_ok(mutation, Syncler.Mutation.Class.Create, 'First mutation is an instance creation')
        
        t.ok(mutation.className == 'Syncler.Attribute.Object', 'And its creation of `Syncler.Attribute.Object` (for topic initialization)')

        
        //======================================================================================================================================================================================================================================================
        t.diag('Replica internals')
        
        t.ok(replica.getCount() == 5, '5 objects in scope (1 replica, 1 topic, 1 flash and 2 composite attributes)')
        
        
        var topicID = replica.objectToId(topic)
        
        t.ok(topicID == topic.getTopicID(), 'Topic ID has been used as object ID')
        
        t.ok(replica.idToObject(topicID) == topic, 'Correct object resolved')
        

        //======================================================================================================================================================================================================================================================
        t.diag('Undo/redo')
        
        replica.undoTentative()
        
        t.ok(replica.getCount() == 1, 'No objects in scope (only replica)')
        
        replica.redoTentative()
        
        t.ok(replica.getCount() == 5, '5 objects in scope')
        
        //======================================================================================================================================================================================================================================================
        t.diag('Topic copy')
        
        var topic2 = replica.idToObject(topicID)
        
        t.isa_ok(topic2, Topic, 'Correct class for topic')
        
        t.ok(topic2 == topic, 'And its the same object (to keep the references)')
        
        t.ok(topic2.str == 'bar-baz', 'Correct `str` for topic2')
        t.isa_ok(topic2.obj, Syncler.Attribute.Object, 'Correct class for `obj` for topic2')
        t.ok(topic2.getTopicID() == topicID, 'Correct `topicID` for topic2')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('getInheritanceChainOf')
        
        t.isDeeply(replica.getInheritanceChainOf(Topic), [ 'Topic' ], 'Correct result for `getInheritanceChainOf`')
        
        Class('SubTopic', {
            isa     : Topic
        })
        
        t.isDeeply(replica.getInheritanceChainOf(SubTopic), [ 'Topic', 'SubTopic' ], 'Correct result for `getInheritanceChainOf`')
        
        
        t.done()
    })
    
})