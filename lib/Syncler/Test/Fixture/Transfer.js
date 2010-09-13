Class('Syncler.Test.Fixture.Transfer', {
    
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
                
                var CONTINUE = this.getCONTINUE()
            
                
                //======================================================================================================================================================================================================================================================
                t.diag('Class declaration')
                
                
                Class('TestClass', {
                    
                    trait   : Syncler.Vero.Meta,
                    
                    does    : [
                        'Syncler.Vero.Role.Topic',
                        'KiokuJS.Feature.Class.OwnUUID'
                    ],
                    
                    has : {
                        attr1 : {
                            trait : Syncler.Vero.Attribute,
                            
                            init    : 'attr1'
                            
                        },
                        
                        attr2 : {
                            trait : Syncler.Vero.Attribute
                        },
                        
                        
                        attr3 : {
                            trait : Syncler.Vero.Attribute
                        }
                    },
                    
                    
                    methods : {
                        
                        getTopicID : function () {
                            return this.uuid
                        }
                    } 
                    
                })
                
                
                t.ok(TestClass, 'TestClass is here')
                
                
                //======================================================================================================================================================================================================================================================
                t.diag('Establishing source channel')
                
                var synclerSource        = new Syncler({
                    fayeURL     : 'http://local/8080/faye',
                    baseURL     : 'http://local/8080/'
                })
                var channelSource        = synclerSource.createChannel()

                
                var test = new TestClass({
                    channel : channelSource,
                    
                    attr2   : 'attr2',
                    attr3   : 'attr3'
                })
                
                
                channelSource.establish().andThen(function () {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Establishing receiver channel')
                    
                    var synclerReceiver        = new Syncler({
                        fayeURL     : 'http://local/8080/faye',
                        baseURL     : 'http://local/8080/'
                    })
                    
                    var topicID     = test.getTopicID()
                    
                    synclerReceiver.establishChannel(topicID).andThen(function (channelReceiver) {
                        
                        t.ok(channelReceiver, 'Receiver channel has been created')
                        
                        //======================================================================================================================================================================================================================================================
                        t.diag('Checking topic')
                        
                        var topic = channelReceiver.getTopic()
                        

                        t.isa_ok(topic, TestClass, 'Channel has topic set')
                        
                        t.ok(topic.channel == channelReceiver, 'Topic refer to correct channel')
                        
                        t.ok(topic.VERO, 'Topic has VERO instance attached')
                        
                        t.ok(topic.attr2 == 'attr2' && topic.attr3 == 'attr3', 'Topic has correct attribute values')
                        
                        // delay to give faye time to subscribe
                        setTimeout(function () {
                            
                            var foo = { foo : 'bar' }
                            
                            test.setAttr1(foo)
                            test.setAttr2([ foo, 'bar', foo ])
                            test.setAttr3('attr3-mutated')
                            
                            channelSource.commit()
                            
                        }, 1000)
                        
                        
                        channelReceiver.on('mutation', function (instance, packet, channel) {
                            t.pass('Reached `mutation` handler of the receiver channel')
                            
                            instanceMutated = true
                            
                            t.ok(instance.uuid == test.uuid, "Correct instance is being mutated")
                            
                            var attr1 = instance.attr1
                            var attr2 = instance.attr2
                            var attr3 = instance.attr3
                            
                            t.ok(attr1.foo == 'bar', 'Correct value for `attr1`')
                            t.ok(attr2.length == 3, 'Correct length for `attr2`')
                            t.ok(attr3 == 'attr3-mutated', 'Correct value for `attr3`')
                            
//                            t.ok()
                            
//                            instance.setAttr3('attr3-from-channel2')
//                            
//                            instance.commit()
//                            
//                            channel2.commit()
                        })
                        
//                        channel1.on('mutation', function (instance, packet, channel) {
//                            instanceMutatedBack = true
//                            
//                            t.ok(instance === test, "Correct instance is being mutated")
//                            
//                            t.ok(instance.attr3 == 'attr3-from-channel2', 'Correct value for `attr3`')
//                        })
                        
                    })
                })
                
                var instanceMutated     = false
                var instanceMutatedBack = false
            
                var async1 = t.beginAsync()
                
                // delay to keep the <iframe> of the test, otherwise XHR will stop working
                setTimeout(function () {
                    
                    t.ok(instanceMutated, 'Instance has been mutated')
                    t.ok(instanceMutatedBack, 'Instance has been mutated back to the 1st channel')
                    
                    t.endAsync(async1)
                    
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
