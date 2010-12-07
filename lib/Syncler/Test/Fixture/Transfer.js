Class('Syncler.Test.Fixture.Transfer', {
    
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
                
                var CONTINUE = this.getCONTINUE()
                
                //======================================================================================================================================================================================================================================================
                t.diag('Establishing source replica')
                
                
                var test = new Syncler.Test.TestClass({
                    replica : handle.newReplica(),
                    
                    attr2   : 'attr2',
                    attr3   : 'attr3'
                })
                
                
                handle.setupReplica({ topic : test }).andThen(function (replicaSource) {
                    
                    var handle2 = new KiokuJS.Backend.CouchDB({
                        trait   : [ Syncler.Client, KiokuJS.Backend.Batch ],
                        
                        baseURL     : 'http://local/' + handle.__port__,
                        dbURL       : handle.dbURL,
                        
                        port        : handle.__port__
                    })
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Establishing receiver replica')
                    
                    handle2.setupReplica({ topicID : test.getTopicID() }).andThen(function (replicaReceiver) {
                        
                        t.ok(replicaReceiver, 'Receiver replica has been created')
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Checking topic')
                        
                        var topic = replicaReceiver.getTopic()
                        
                        t.isa_ok(topic, Syncler.Test.TestClass, 'Replica has topic set')
                        
                        t.ok(topic.replica == replicaReceiver, 'Topic refer to correct replica')
                        
                        t.ok(topic.attr2 == 'attr2' && topic.attr3 == 'attr3', 'Topic has correct attribute values')
                        
                        // delay to give faye time to subscribe
                        setTimeout(function () {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Mutation in the source replica')
                        
                            var foo = { foo : 'bar' }
                            
                            test.setAttr1(foo)
                            test.setAttr2([ foo, 'baz', foo ])
                            test.setAttr3('attr3-mutated')
                            
//                            replicaSource.commit()
                            
                        }, 1000)
                        
                        
                        replicaReceiver.on('update-packet', function (replica, mutations) {
                            t.pass('Reached `update-packet` handler of the receiver replica')
                            
                            instanceMutated = true
                            
                            t.ok(mutations.length == 3, 'Correct length of mutation packet')
                            
                            var instance = replica.getTopic()
                            
                            var attr1 = instance.attr1
                            var attr2 = instance.attr2
                            var attr3 = instance.attr3
                            
                            t.ok(attr1.foo == 'bar', 'Correct value for `attr1`')
                            t.ok(attr2.length == 3, 'Correct length for `attr2`')
                            t.ok(attr3 == 'attr3-mutated', 'Correct value for `attr3`')
                            
                            t.ok(attr2[0] == attr1 && attr2[2] == attr1, 'Correct value for `attr2` #1')
                            t.ok(attr2[1] == 'baz', 'Correct value for `attr2` #2')
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Mutation in the receiver replica')
                            
                            instance.setAttr3('attr3-from-receiver-replica')
                            
//                            replicaReceiver.commit()
                        })
                        
                        
                        replicaSource.on('update-packet', function (replica, mutations) {
                            t.pass('Reached `update-packet` handler of the source replica')
                            
                            instanceMutatedBack = true
                            
                            t.ok(test.attr3 == 'attr3-from-receiver-replica', 'Correct value for `attr3`')
                            
                            t.ok(test.attr1.foo == 'bar', "Other attributes didn't change")
                        })
                        
                    })
                })
                
                var instanceMutated     = false
                var instanceMutatedBack = false
            
                // delay to keep the <iframe> of the test, otherwise XHR will stop working
                setTimeout(function () {
                    
                    t.ok(instanceMutated, 'Instance has been mutated')
                    t.ok(instanceMutatedBack, 'Instance has been mutated back to the 1st replica')
                    
                    CONTINUE()
                    
                }, 3000)
            },
            // eof populate
            
            
            verify : function (handle, t) {
                this.CONTINUE()
            }
            // eof verify
        }
    }

})
