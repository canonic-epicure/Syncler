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
                arr         : Syncler.I.Array,
                
                // suppress FLASH creation
                FLASH       : null,
                ownFlash    : null
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
        
        t.ok(replica.tentativeQueue.length == 3, 'Replica contains 3 mutations')
        
        var arr     = topic.arr
        var obj     = topic.obj
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Group mutations')
        
        topic.write(new Syncler.Mutation.Group({
            
            group   : [
                new Syncler.Mutation.Array.Push({
                    objectID        : replica.objectToID(topic.arr),
                    
                    newValues       : [ 'foo', 'bar' ]
                }),
                
                new Syncler.Mutation.Object.Set({
                    objectID        : replica.objectToID(topic.obj),
                    
                    key             : 'baz',
                    
                    newValue        : 'quix'
                }),
                
                new Syncler.Mutation.Array.Splice({
                    objectID        : replica.objectToID(topic.arr),
                    startAt         : 0,
                    
                    removeCount     : 1,
                    
                    newValues       : []
                }),
                
                new Syncler.Mutation.Class.Attribute({
                    objectID        : replica.objectToID(topic),
                    
                    attributeName   : 'str',
                    
                    newValue        : 'zox'
                })
            ]
        }))
        
        t.ok(replica.tentativeQueue.length == 4, 'New mutation has been added to tentative queue')
        t.isa_ok(replica.tentativeQueue[ 3 ], Syncler.Mutation.Group, 'Correct class for new mutation')
        
        t.is_deeply(arr.value, [ 'bar' ], 'Correct array after all mutations')
        t.is_deeply(obj.value, { baz : 'quix' }, 'Correct object after all mutations')
        
        t.ok(topic.str == 'zox', 'Correct value for `str` attribute')
        
//
//        
//        arr.set(0, 'value')
//        
//        // [ 'value', 'value4' ]
//        
//        t.is_deeply(arr.value, [ 'value', 'value4' ], 'Correct array after all mutations')
//        t.ok(replica.tentativeQueue.length == 5, 'New mutation has been added to tentative queue')
//        
//        t.isa_ok(replica.tentativeQueue[ 4 ], Syncler.Mutation.Array.Set, 'Correct class for new mutation')
//        
//        
//        arr.set(1, 'value2')
//        
//        // [ 'value', 'value2' ]
//        
//        t.is_deeply(arr.value, [ 'value', 'value2' ], 'Correct array after all mutations')
//        t.ok(replica.tentativeQueue.length == 6, 'New mutation has been added to tentative queue')
//        t.isa_ok(replica.tentativeQueue[ 5 ], Syncler.Mutation.Array.Set, 'Correct class for new mutation')
//        
//        
//        arr.unshift('value-1', 'value0')
//        
//        // [ 'value-1', 'value0', 'value', 'value2' ]
//        
//        t.ok(replica.tentativeQueue.length == 7, 'New mutation has been added to tentative queue')
//        t.is_deeply(arr.value, [ 'value-1', 'value0', 'value', 'value2' ], 'Correct array after all mutations')
//        t.isa_ok(replica.tentativeQueue[ 6 ], Syncler.Mutation.Array.Splice, 'Correct class for new mutation')
//        
//
//        
//        var value = arr.shift()
//        
//        // [ 'value0', 'value', 'value2' ]
//        
//        t.ok(value == 'value-1', 'Correct value returned from `shift`')
//        
//        t.ok(replica.tentativeQueue.length == 8, 'New mutation has been added to tentative queue')
//        t.is_deeply(arr.value, [ 'value0', 'value', 'value2' ], 'Correct array after all mutations')
//        t.isa_ok(replica.tentativeQueue[ 7 ], Syncler.Mutation.Array.Splice, 'Correct class for new mutation')
//        
//
//        var value = arr.pop()
//        
//        // [ 'value0', 'value' ]
//        
//        t.ok(value == 'value2', 'Correct value returned from `pop`')
//        
//        t.ok(replica.tentativeQueue.length == 9, 'New mutation has been added to tentative queue')
//        t.is_deeply(arr.value, [ 'value0', 'value' ], 'Correct array after all mutations')
//        t.isa_ok(replica.tentativeQueue[ 8 ], Syncler.Mutation.Array.Pop, 'Correct class for new mutation')
//        
//        
//        var values = arr.splice(0, 2, 'splice')
//        
//        // [ 'splice' ]
//        
//        t.is_deeply(values, [ 'value0', 'value' ], 'Correct values returned from `splice`')
//        
//        t.ok(replica.tentativeQueue.length == 10, 'New mutation has been added to tentative queue')
//        t.is_deeply(arr.value, [ 'splice' ], 'Correct array after all mutations')
//        t.isa_ok(replica.tentativeQueue[ 9 ], Syncler.Mutation.Array.Splice, 'Correct class for new mutation')
//        
//        
//        
//        //======================================================================================================================================================================================================================================================
//        t.diag('Unapply-ing mutations (should be performed in reverse order only')
//
//        replica.tentativeQueue[ 9 ].unapply(replica)
//        
//        t.is_deeply(arr.value, [ 'value0', 'value' ], 'Correctly rolled back the state of array')
//
//        
//        replica.tentativeQueue[ 8 ].unapply(replica)
//        
//        t.is_deeply(arr.value, [ 'value0', 'value', 'value2' ], 'Correctly rolled back the state of array')
//        
//        
//        replica.tentativeQueue[ 7 ].unapply(replica)
//        
//        t.is_deeply(arr.value, [ 'value-1', 'value0', 'value', 'value2' ], 'Correctly rolled back the state of array')
//
//        
//        replica.tentativeQueue[ 6 ].unapply(replica)
//        
//        t.is_deeply(arr.value, [ 'value', 'value2' ], 'Correctly rolled back the state of array')
//
//        
//        replica.tentativeQueue[ 5 ].unapply(replica)
//        
//        t.is_deeply(arr.value, [ 'value', 'value4' ], 'Correctly rolled back the state of array')
//        
//        
//        replica.tentativeQueue[ 4 ].unapply(replica)
//        
//        t.is_deeply(arr.value, [ 'value3', 'value4' ], 'Correctly rolled back the state of array')
//        
//        
//        replica.tentativeQueue[ 3 ].unapply(replica)
//        
//        t.is_deeply(arr.value, [], 'Correctly rolled back the state of array')
        
        
        t.done()
    })
    
})