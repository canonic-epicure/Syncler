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
        
        t.ok(replica.tentativeQueue.length == 3, 'Operation contains 3 mutations')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Object set mutation')
        
        var obj     = topic.obj
        
        obj.set('key', 'value')
        
        t.ok(obj.get('key') == 'value', 'Key has been set #1')
        t.ok(obj.hasOwnKey('key'), 'Key has been set #2')
        
        t.ok(replica.tentativeQueue.length == 4, 'New mutation has been added to tentative queue')
        t.isa_ok(replica.tentativeQueue[ 3 ], Syncler.Mutation.Object.Set, 'Correct class for new mutation')

        
        obj.set('key2', 'value2')
        
        t.ok(replica.tentativeQueue.length == 5, 'New mutation has been added to tentative queue')
        
        
        obj.remove('key2')
        
        t.ok(obj.get('key2') == undefined, 'Key has been unset #1')
        t.ok(!obj.hasOwnKey('key2'), 'Key has been unset #2')
        
        t.ok(replica.tentativeQueue.length == 6, 'New mutation has been added to tentative queue')
        t.isa_ok(replica.tentativeQueue[ 5 ], Syncler.Mutation.Object.Remove, 'Correct class for new mutation')
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Unapply-ing mutations (should be performed in reverse order only')

        replica.tentativeQueue[ 5 ].unapply(replica)
        
        t.ok(obj.hasOwnKey('key2'), 'Key has been un-unset #1')
        t.ok(obj.get('key2') == 'value2', 'Key has been un-unset #2')

        
        replica.tentativeQueue[ 4 ].unapply(replica)
        
        t.ok(!obj.hasOwnKey('key2'), 'No `key2` yet')
        t.ok(obj.get('key2') == undefined, 'No `key2` yet')
        

        replica.tentativeQueue[ 3 ].unapply(replica)
        
        t.ok(!obj.hasOwnKey('key'), 'No `key` yet')
        t.ok(obj.get('key') == undefined, 'No `key` yet')
        
        
//        
//        //======================================================================================================================================================================================================================================================
//        t.diag('Replica internals')
//        
//        t.ok(replica.getCount() == 4, '4 objects in scope (1 replica, 1 topic and 2 composite attributes)')
//        
//        
//        var topicID = replica.objectToId(topic)
//        
//        t.ok(topicID == topic.getTopicID(), 'Topic ID has been used as object ID')
//        
//        t.ok(replica.idToObject(topicID) == topic, 'Correct object resolved')
//        
//
//        //======================================================================================================================================================================================================================================================
//        t.diag('Undo/redo')
//        
//        replica.undoTentative()
//        
//        t.ok(replica.getCount() == 1, 'No objects in scope (only replica)')
//        
//        replica.redoTentative()
//        
//        t.ok(replica.getCount() == 4, '4 objects in scope')
//        
//        //======================================================================================================================================================================================================================================================
//        t.diag('Topic copy')
//        
//        var topic2 = replica.idToObject(topicID)
//        
//        t.isa_ok(topic2, Topic, 'Correct class for topic')
//        
//        t.ok(topic2 != topic, 'But its a different object')
//        
//        t.ok(topic2.str == 'bar-baz', 'Correct `str` for topic2')
//        t.isa_ok(topic2.obj, Syncler.Attribute.Object, 'Correct class for `obj` for topic2')
//        t.ok(topic2.getTopicID() == topicID, 'Correct `topicID` for topic2')
        
        
        t.done()
    })
    
})