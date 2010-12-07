Class('Syncler.Test.Fixture.NewElement', {
    
    use     : 'Syncler.Test.TestClass',
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('Syncler.Test.Fixture.NewElement - Sanity')
                
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
                        
                        fayeClient  : handle.fayeClient
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
                        
                        t.ok(topic.VERO, 'Topic has VERO instance attached')
                        
                        t.ok(topic.attr2 == 'attr2' && topic.attr3 == 'attr3', 'Topic has correct attribute values')
                        
                        // delay to give faye time to subscribe
                        setTimeout(function () {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Mutation in the source replica')
                        
                            var newTest = new Syncler.Test.TestClass({
                                replica : replicaSource,
                                
                                attr2   : 'new2',
                                attr3   : 'new3'
                            })
                            
                            newTest.setAttr2('new2-mutated')
                            
                            test.setAttr1(newTest)
                            test.setAttr2('attr2-mutated')
                            
                            replicaSource.commit()
                            
                        }, 1000)
                        
                        
                        replicaReceiver.on('update-packet', function (replica, mutations) {
                            t.pass('Reached `update` handler of the receiver replica')
                            
                            updateReached = true
                            
                            var topic           = replica.getTopic()
                            
                            t.ok(topic.attr2 == 'attr2-mutated', 'Correct value for `attr2`')
                            
                            
                            var newInstance     = topic.getAttr1()
                            
                            t.isaOk(newInstance, Syncler.Test.TestClass, 'New instance appeared as `attr1` value')
                            
                            t.ok(newInstance.attr2 == 'new2-mutated', 'New instance has correct `attr2` value')
                        })
                    })
                })
                
                var updateReached     = false
            
                // delay to keep the <iframe> of the test, otherwise XHR will stop working
                setTimeout(function () {
                    
                    t.ok(updateReached, 'Update has been reached')
                    
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
