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
        t.diag('Array mutations')
        
        var arr     = topic.arr
        
        arr.set(0, 'value')
        
        // [ 'value' ]
        
        t.ok(arr.get(0) == 'value', '0 index has been set #1')
        t.ok(arr.length() == 1, '0 index has been set #2')
        
        t.ok(replica.tentativeQueue.length == 4, 'New mutation has been added to tentative queue')
        t.isa_ok(replica.tentativeQueue[ 3 ], Syncler.Mutation.Array.Set, 'Correct class for new mutation')

        
        arr.set(1, 'value2')
        
        // [ 'value', 'value2' ]
        
        t.is_deeply(arr.value, [ 'value', 'value2' ], 'Correct array after all mutations')
        t.ok(replica.tentativeQueue.length == 5, 'New mutation has been added to tentative queue')
        
        
        arr.push('value3', 'value4')
        
        // [ 'value', 'value2', 'value3', 'value4' ]
        
        t.is_deeply(arr.value, [ 'value', 'value2', 'value3', 'value4' ], 'Correct array after all mutations')
        t.ok(replica.tentativeQueue.length == 6, 'New mutation has been added to tentative queue')
        t.isa_ok(replica.tentativeQueue[ 5 ], Syncler.Mutation.Array.Push, 'Correct class for new mutation')
        
        
        arr.unshift('value-1', 'value0')
        
        // [ 'value-1', 'value0', 'value', 'value2', 'value3', 'value4' ]
        
        t.ok(replica.tentativeQueue.length == 7, 'New mutation has been added to tentative queue')
        t.is_deeply(arr.value, [ 'value-1', 'value0', 'value', 'value2', 'value3', 'value4' ], 'Correct array after all mutations')
        t.isa_ok(replica.tentativeQueue[ 6 ], Syncler.Mutation.Array.Splice, 'Correct class for new mutation')
        

        
        var value = arr.shift()
        
        // [ 'value0', 'value', 'value2', 'value3', 'value4' ]
        
        t.ok(value == 'value-1', 'Correct value returned from `shift`')
        
        t.ok(replica.tentativeQueue.length == 8, 'New mutation has been added to tentative queue')
        t.is_deeply(arr.value, [ 'value0', 'value', 'value2', 'value3', 'value4' ], 'Correct array after all mutations')
        t.isa_ok(replica.tentativeQueue[ 7 ], Syncler.Mutation.Array.Splice, 'Correct class for new mutation')
        

        var value = arr.pop()
        
        // [ 'value0', 'value', 'value2', 'value3' ]
        
        t.ok(value == 'value4', 'Correct value returned from `pop`')
        
        t.ok(replica.tentativeQueue.length == 9, 'New mutation has been added to tentative queue')
        t.is_deeply(arr.value, [ 'value0', 'value', 'value2', 'value3' ], 'Correct array after all mutations')
        t.isa_ok(replica.tentativeQueue[ 8 ], Syncler.Mutation.Array.Pop, 'Correct class for new mutation')
        
        
        var values = arr.splice(1, 2, 'splice')
        
        // [ 'value0', 'splice', 'value3' ]
        
        t.is_deeply(values, [ 'value', 'value2' ], 'Correct values returned from `splice`')
        
        t.ok(replica.tentativeQueue.length == 10, 'New mutation has been added to tentative queue')
        t.is_deeply(arr.value, [ 'value0', 'splice', 'value3' ], 'Correct array after all mutations')
        t.isa_ok(replica.tentativeQueue[ 9 ], Syncler.Mutation.Array.Splice, 'Correct class for new mutation')
        
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('Unapply-ing mutations (should be performed in reverse order only')

        replica.tentativeQueue[ 9 ].unapply(replica)
        
        t.is_deeply(arr.value, [ 'value0', 'value', 'value2', 'value3' ], 'Correctly rolled back the state of array')

        
        replica.tentativeQueue[ 8 ].unapply(replica)
        
        t.is_deeply(arr.value, [ 'value0', 'value', 'value2', 'value3', 'value4' ], 'Correctly rolled back the state of array')
        
        
        replica.tentativeQueue[ 7 ].unapply(replica)
        
        t.is_deeply(arr.value, [ 'value-1', 'value0', 'value', 'value2', 'value3', 'value4' ], 'Correctly rolled back the state of array')

        
        replica.tentativeQueue[ 6 ].unapply(replica)
        
        t.is_deeply(arr.value, [ 'value', 'value2', 'value3', 'value4' ], 'Correctly rolled back the state of array')

        
        replica.tentativeQueue[ 5 ].unapply(replica)
        
        t.is_deeply(arr.value, [ 'value', 'value2' ], 'Correctly rolled back the state of array')
        
        
        replica.tentativeQueue[ 4 ].unapply(replica)
        
        t.is_deeply(arr.value, [ 'value' ], 'Correctly rolled back the state of array')
        
        
        replica.tentativeQueue[ 3 ].unapply(replica)
        
        t.is_deeply(arr.value, [], 'Correctly rolled back the state of array')
        
        
        t.done()
    })
    
})