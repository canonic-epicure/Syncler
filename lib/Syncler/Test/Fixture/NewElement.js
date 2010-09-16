Class('Syncler.Test.Fixture.NewElement', {
    
    use     : 'Syncler.Test.Class',
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('Syncler.Test.Fixture.Composite - Sanity')
                
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
                
                console.log('synclerSource uuid: ' + synclerSource.uuid)

                
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
                    
                    console.log('synclerReceiver uuid: ' + synclerReceiver.uuid)
                    
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
                        
                            var newTest = new Syncler.Test.Class({
                                channel : channelSource,
                                
                                attr2   : 'new2',
                                attr3   : 'new3'
                            })
                            
                            newTest.setAttr2('new2-mutated')
                            
                            newTest.commit()
                            
                            test.setAttr1(newTest)
                            test.setAttr2('attr2-mutated')
                            
                            test.commit()
                            
                            
                            channelSource.commit()
                            
                        }, 1000)
                        
                        
                        channelReceiver.on('update', function (channel, instance, packet) {
                            t.pass('Reached `update` handler of the receiver channel')
                            
                            updateReached = true
                            
                            var topic           = channel.getTopic()
                            
                            t.ok(topic.attr2 == 'attr2-mutated', 'Correct value for `attr2`')
                            
                            
                            var newInstance     = topic.getAttr1()
                            
                            t.isaOk(newInstance, Syncler.Test.Class, 'New instance appeared as `attr1` value')
                            
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
