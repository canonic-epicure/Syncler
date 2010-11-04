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
                t.diag('Syncler.Test.Fixture.Composite - Sanity')
                
                t.ok(Syncler.Vero.Meta, "Syncler.Vero.Meta is here")
                t.ok(Syncler.Test.TestClass, 'Syncler.Test.TestClass is here')
                
                var CONTINUE = this.getCONTINUE()
                
                //======================================================================================================================================================================================================================================================
                t.diag('Establishing source channel')
                

                var test = new Syncler.Test.TestClass({
                    channel : handle.newChannel(),
                    
                    attr2   : 'attr2',
                    attr3   : 'attr3'
                })
                
                handle.setupChannel({ topic : test }).andThen(function (channelSource) {
                    
                    var handle2 = new KiokuJS.Backend.CouchDB({
                        trait   : [ Syncler.Client, KiokuJS.Backend.Batch ],
                        
                        baseURL     : 'http://local/' + handle.__port__,
                        dbURL       : handle.dbURL,
                        
                        fayeClient  : handle.fayeClient
                    })
                    
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Establishing receiver channel')
                    
                    handle2.setupChannel({ topicID : test.getTopicID() }).andThen(function (channelReceiver) {
                        
                        t.ok(channelReceiver, 'Receiver channel has been created')
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Checking topic')
                        
                        var topic = channelReceiver.getTopic()
                        

                        t.isa_ok(topic, Syncler.Test.TestClass, 'Channel has topic set')
                        
                        t.ok(topic.channel == channelReceiver, 'Topic refer to correct channel')
                        
                        t.ok(topic.VERO, 'Topic has VERO instance attached')
                        
                        t.ok(topic.attr2 == 'attr2' && topic.attr3 == 'attr3', 'Topic has correct attribute values')
                        
                        // delay to give faye time to subscribe
                        setTimeout(function () {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Mutation in the source channel')
                        
                            var newTest = new Syncler.Test.TestClass({
                                channel : channelSource,
                                
                                attr2   : 'new2',
                                attr3   : 'new3'
                            })
                            
                            newTest.setAttr2('new2-mutated')
                            
                            test.setAttr1(newTest)
                            test.setAttr2('attr2-mutated')
                            
                            channelSource.commit()
                            
                        }, 1000)
                        
                        
                        channelReceiver.on('update-packet', function (channel, mutations) {
                            t.pass('Reached `update` handler of the receiver channel')
                            
                            updateReached = true
                            
                            var topic           = channel.getTopic()
                            
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
