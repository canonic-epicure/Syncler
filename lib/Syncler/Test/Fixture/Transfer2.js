Class('Syncler.Test.Fixture.Transfer2', {
    
    use     : 'Syncler.Test.TestClass',
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('Syncler.Test.Fixture.Transfer - Sanity')
                
                t.ok(Syncler.Object, "Syncler.Object is here")
                t.ok(Syncler.Test.TestClass, 'Syncler.Test.TestClass is here')
                
                //======================================================================================================================================================================================================================================================
                t.diag('Establishing source replica')
                
                
                var source = new Syncler.Test.TestClass({
                    replica : handle.newReplica()
                })
                
                handle.setupReplica({ topic : source }).andThen(function (replicaSource) {
                    
                    var handle2 = new KiokuJS.Backend.CouchDB({
                        trait   : [ Syncler.Client, KiokuJS.Backend.Batch ],
                        
                        baseURL     : 'http://local/' + handle.__port__,
                        dbURL       : handle.dbURL,
                        
                        port        : handle.__port__
                    })
                    
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Establishing receiver replica')
                    
                    handle2.setupReplica({ topicID : source.getTopicID() }).andThen(function (replicaReceiver) {
                        
                        var receiver = replicaReceiver.getTopic()
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Mutation in the source replica')
                    
                        source.obj1.set('foo2', 'bar2')
                        
                        source.arr2.push('foo', 'baz', 'foo')
                        
                        source.obj3.set('foo3-1', source.obj1)
                        source.obj3.set('foo3-2', source.arr2)
                        
                        
                        // delay to give updates time to propagate
                        setTimeout(function () {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Checking the state in the receiving replica after 1s delay')
                            
                            t.isDeeply(receiver.obj1.value, { foo2 : 'bar2' }, 'Correct value for `obj1`')
                            t.isDeeply(receiver.arr2.value, [ 'foo', 'baz', 'foo' ], 'Correct value for `arr2`')
                            
                            t.ok(receiver.obj3.get('foo3-1') == receiver.obj1, 'Correct value for `obj3.foo3-1`')
                            t.ok(receiver.obj3.get('foo3-2') == receiver.arr2, 'Correct value for `obj3.foo3-2`')

                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Mutation in the receiver replica')
                            
                            receiver.obj1.set('baz', 'quix')
                            receiver.obj3.remove('foo3-2')
                            receiver.arr2.shift()
                            receiver.arr2.splice(1, 1)
                            
                        }, 1000)
                        

                        
                        // delay to give updates time to propagate
                        setTimeout(function () {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Checking the state in the source replica after 1s delay')
                        
                            t.isDeeply(source.obj1.value, { foo2 : 'bar2', baz : 'quix' }, 'Correct value for `obj1`')
                            t.isDeeply(source.arr2.value, [ 'baz' ], 'Correct value for `arr2`')
                            
//                            debugger
                            
                            t.ok(!source.obj3.hasOwnKey('foo3-2'), 'No `foo3-2` key in `obj3`')
                            
                            t.ok(source.obj3.get('foo3-1') == source.obj1, 'Correct value for `obj3.foo3-1`')
                            
                        }, 2000)
                        
                        
                        // delay to keep the <iframe> of the test, otherwise XHR will stop working
                        setTimeout(this.getCONTINUE(), 3000)
                    })
                })
            },
            // eof populate
            
            
            verify : function (handle, t) {
                this.CONTINUE()
            }
            // eof verify
        }
    }

})
