Class('Syncler.Test.Fixture.Transfer', {
    
    use     : 'Syncler.Test.Class',
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('Syncler.Test.Fixture.Basic - Sanity')
                
                t.ok(Syncler, "Syncler is here")
                t.ok(Syncler.Vero.Meta, "Syncler.Vero.Meta is here")
                t.ok(Syncler.Test.Class, 'Syncler.Test.Class is here')
                
                var CONTINUE = this.getCONTINUE()
                
                //======================================================================================================================================================================================================================================================
                t.diag('Establishing source channel')
                
                var synclerSource        = new Syncler({
                    fayeURL     : handle.backend.baseURL + '/faye',
                    baseURL     : handle.backend.baseURL
                })
                var channelSource        = synclerSource.createChannel()

                
                var test = new Syncler.Test.Class({
                    channel : channelSource,
                    
                    attr2   : 'attr2',
                    attr3   : 'attr3'
                })
                
                
                channelSource.establish().andThen(function () {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Establishing receiver channel')
                    
                    var synclerReceiver        = new Syncler({
                        fayeURL     : handle.backend.baseURL + '/faye',
                        baseURL     : handle.backend.baseURL
                    })
                    
                    var topicID     = test.getTopicID()
                    
                    synclerReceiver.establishChannel(topicID).andThen(function (channelReceiver) {
                        
                        t.ok(channelReceiver, 'Receiver channel has been created')
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Checking topic')
                        
                        var topic = channelReceiver.getTopic()
                        

                        t.isa_ok(topic, Syncler.Test.Class, 'Channel has topic set')
                        
                        t.ok(topic.channel == channelReceiver, 'Topic refer to correct channel')
                        
                        t.ok(topic.VERO, 'Topic has VERO instance attached')
                        
                        t.ok(topic.attr2 == 'attr2' && topic.attr3 == 'attr3', 'Topic has correct attribute values')
                        
                        // delay to give faye time to subscribe
                        setTimeout(function () {
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Mutation in the source channel')
                        
                            var foo = { foo : 'bar' }
                            
                            test.setAttr1(foo)
                            test.setAttr2([ foo, 'baz', foo ])
                            test.setAttr3('attr3-mutated')
                            
                            test.commit()
                            
                            channelSource.commit()
                            
                        }, 1000)
                        
                        
                        channelReceiver.on('mutation', function (channel, instance, packet) {
                            t.pass('Reached `mutation` handler of the receiver channel')
                            
                            instanceMutated = true
                            
                            t.ok(instance.uuid == test.uuid, "Correct instance is being mutated")
                            
                            var attr1 = instance.attr1
                            var attr2 = instance.attr2
                            var attr3 = instance.attr3
                            
                            t.ok(attr1.foo == 'bar', 'Correct value for `attr1`')
                            t.ok(attr2.length == 3, 'Correct length for `attr2`')
                            t.ok(attr3 == 'attr3-mutated', 'Correct value for `attr3`')
                            
                            t.ok(attr2[0] == attr1 && attr2[2] == attr1, 'Correct value for `attr2` #1')
                            t.ok(attr2[1] == 'baz', 'Correct value for `attr2` #2')
                            
                            //======================================================================================================================================================================================================================================================
                            t.diag('Mutation in the receiver channel')
                            
                            instance.setAttr3('attr3-from-receiver-channel')
                            
                            instance.commit()
                            
                            channelReceiver.commit()
                        })
                        
                        
                        channelSource.on('mutation', function (channel, instance, packet) {
                            instanceMutatedBack = true
                            
                            t.ok(instance === test, "Correct instance is being mutated")
                            
                            t.ok(instance.attr3 == 'attr3-from-receiver-channel', 'Correct value for `attr3`')
                            
                            t.ok(instance.attr1.foo == 'bar', "Other attributes didn't change")
                        })
                        
                    })
                })
                
                var instanceMutated     = false
                var instanceMutatedBack = false
            
                // delay to keep the <iframe> of the test, otherwise XHR will stop working
                setTimeout(function () {
                    
                    t.ok(instanceMutated, 'Instance has been mutated')
                    t.ok(instanceMutatedBack, 'Instance has been mutated back to the 1st channel')
                    
                    CONTINUE()
                    
                }, 5000)
            },
            // eof populate
            
            
            verify : function (handle, t) {
                this.CONTINUE()
            }
            // eof verify
        }
    }

})
