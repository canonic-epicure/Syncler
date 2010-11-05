Class('Syncler.Test.Fixture.StressLoad', {
    
    use     : 'Syncler.Test.TestClass',
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10,
        
        actors                  : Joose.I.Object,
        
        actorsNum               : 10,
        
        minEventsDelay          : 500,
        maxEventsDelay          : 2000,
        
        minEventsNum            : 10,
        maxEventsNum            : 30,
        
        topic                   : null
    },
    
    
    methods : {
        
        forEachActor : function (func) {
            for (var i = 1; i <= this.actorsNum; i++) 
                if (func.call(this, this.actors[ 'actor' + i ]) === false) return false
        },
        
        
        compareTopics : function (topic1, topic2) {
            
            var isEqual     = true
            
            topic1.meta.forEachSyncedAttribute(function (attribute, name) {
                
                isEqual     = isEqual && attribute.getValueFrom(topic1) == attribute.getValueFrom(topic2)
                
                if (!isEqual) return false
            })
            
            return isEqual
        }
    },
    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('Syncler.Test.Fixture.StressLoad - Sanity')
                
                t.ok(Syncler.Test.Actor, 'Syncler.Test.Actor is here')
                
                var topic = this.topic = new Syncler.Test.TestClass({
                    channel : handle.newChannel()
                })
                
                handle.setupChannel({ topic : topic }).andThen(function (channel) {
                    
                    //======================================================================================================================================================================================================================================================
                    t.diag('Creating actors')
                    
                    for (var i = 1; i <= this.actorsNum; i++) {
                        var actor = new Syncler.Test.Actor({
                            
                            topicID             : topic.getTopicID(),
                            
                            sampleHandle        : handle,
                            name                : 'actor' + i
                        })
                        
                        this.actors[ actor.name ] = actor
                    } 
                    
                    this.forEachActor(function (actor) {
                        
                        this.AND(function () {
                            
                            actor.setup().now()
                        })
                    })
                    
                    var me          = this
                    
                    this.THEN(function () {
                        
                        this.forEachActor(function (actor) {
                            
                            this.AND(function () {
                                
                                var eventsNum   = Math.floor(Math.random() * (me.maxEventsNum - me.minEventsNum + 1)) + me.minEventsNum
                                
                                for (var i = 1; i <= eventsNum; i++) {
                                    actor.mutate()
                                    actor.delay(me.minEventsDelay, me.maxEventsDelay)
                                }
                                
                                this.CONT.now()
                            })
                        })
                        
                        this.NOW()
                        
                    }).andThen(function () {
                        
                        // give some time for eventual consistency to become real consistency
                        setTimeout(this.getCONTINUE(), 2000)
                    })
                    
                }, this)
            },
            // eof populate
            
            
            verify : function (handle, t) {
                
                var topic   = this.topic
                
                this.forEachActor(function (actor) {
                    
                    t.ok(this.compareTopics(topic, actor.topic), "Actor's [" + actor.name + "] state has been correctly converged")
                })
                
                this.andTHEN(function () {
                    
                    // give some time for server-side before terminating the test
                    setTimeout(this.getCONTINUE(), 1000)
                })
            }
            // eof verify
        }
    }

})
