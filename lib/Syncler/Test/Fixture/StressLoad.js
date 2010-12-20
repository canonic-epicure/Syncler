Class('Syncler.Test.Fixture.StressLoad', {
    
    use     : 'Syncler.Test.TestClass',
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10,
        
        actors                  : Joose.I.Object,
        
        actorsNum               : 15,
        
        minEventsDelay          : 150,
        maxEventsDelay          : 300,
        
        minEventsNum            : 100,
        maxEventsNum            : 200,
        
        topic                   : null
    },
    
    
    methods : {
        
        forEachActor : function (func) {
            for (var i = 1; i <= this.actorsNum; i++) 
                if (func.call(this, this.actors[ 'actor' + i ], 'actor' + i) === false) return false
        },
        
        
        typeOf : function (object) {
            return Object.prototype.toString.call(object).replace(/^\[object /, '').replace(/\]$/, '')
        },
        
        
        countKeys : function (object) {
            var counter = 0
            
            Joose.O.eachOwn(object, function () {
                counter++
            })
            
            return counter
        },
        
        
        compareObjects : function (obj1, obj2) {
            if (obj1 == obj2) return true
            
            var type1 = this.typeOf(obj1)
            var type2 = this.typeOf(obj2)
            
            if (type1 != type2) return false
            
            
            if (Joose.O.isInstance(obj1) && Joose.O.isInstance(obj2)) {
                
                if (obj1.meta.name != obj2.meta.name) return false
                
                var isEqual = true
                
                obj1.meta.forEachStoredAttribute(function (attribute, name) {
                    
                    if (name == 'replica') return
                    
                    isEqual = isEqual && this.compareObjects(attribute.getRawValueFrom(obj1), attribute.getRawValueFrom(obj2))
                
                    if (!isEqual) return false
                }, this)
                
                return isEqual
            }
            
            if (!Joose.O.isInstance(obj1) && !Joose.O.isInstance(obj2)) {
                if (type1 == 'Array')
                    if (obj1.length != obj2.length) 
                        return false
                    else {
                        for (var i = 0; i < obj1.length; i++)
                            if (!this.compareObjects(obj1[ i ], obj2[ i ])) return false
                        
                        return true
                    }
                
                var me = this
                    
                if (type1 == 'Object')
                    if (this.countKeys(obj1) != this.countKeys(obj2)) 
                        return false
                    else {
                        var res = Joose.O.eachOwn(obj1, function (value, name) {
                            
                            if (!me.compareObjects(value, obj2[ name ])) return false
                        })
                        
                        return res === false ? false : true
                    }
            }
            
            return false
        }, 
        
        
        
        compareTopics : function (topic1, topic2) {
            return this.compareObjects(topic1, topic2)
        },
        
        
        compareTopicsSequentially : function (actor1, actor2) {
            var replica1    = actor1.topic.replica
            var replica2    = actor2.topic.replica
            
            if (replica1.committedQueue.length != replica2.committedQueue.length) debugger
            
            actor1.logTopicMutations()
            actor2.logTopicMutations()
            
            actor1.unapplyAll()
            actor2.unapplyAll()
            
            Joose.A.each(replica1.committedQueue, function (mutation1, index) {
                
                mutation1.apply(replica1)
                
                var mutation2 = replica2.committedQueue[ index ]
                
                mutation2.apply(replica2)
                
                if (!this.compareTopics(actor1.topic, actor2.topic)) {
                    mutation1.unapply(replica1)
                    mutation2.unapply(replica2)
                    
                    debugger
                    
                    mutation1.apply(replica1)
                    mutation2.apply(replica2)
                    
                    if (!this.compareTopics(actor1.topic, actor2.topic)) debugger
                }
                
            }, this)
        }
    },
    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('Syncler.Test.Fixture.StressLoad - Sanity')
                
                t.ok(Syncler.Test.Actor, 'Syncler.Test.Actor is here')
                
                var topic = this.topic = new Syncler.Test.TestClass({
                    replica : handle.newReplica()
                })
                
                handle.setupReplica({ topic : topic }).andThen(function (replica) {
                    
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
                            
                            actor.setup().except(function (e) {
                                
                                debugger
                                
                            }).now()
                        })
                    })
                    
                    var me          = this
                    
                    this.THEN(function () {
                        
                        this.forEachActor(function (actor) {
                            
                            this.AND(function () {
                                
                                var eventsNum   = Math.round(Math.random() * (me.maxEventsNum - me.minEventsNum)) + me.minEventsNum
                                
                                for (var i = 1; i <= eventsNum; i++) {
                                    actor.mutate()
                                    actor.delay(me.minEventsDelay, me.maxEventsDelay)
                                }
                                
                                this.CONT.now()
                            })
                        })
                        
                        this.NOW()
                        
                    }).andThen(function () {
                        
//                        Joose.A.each(arguments, function (res) {
//                            
//                            if (res.length) throw res[0]
//                        })
                        
                        // give some time for eventual consistency to become real consistency
                        setTimeout(this.getCONTINUE(), 3000)
                    })
                    
                }, this)
            },
            // eof populate
            
            
            verify : function (handle, t) {
                
                var topic   = this.topic
                
                t.diag('Total number of mutations: ' + topic.replica.committedQueue.length)
                
                var failedActor
                
                this.forEachActor(function (actor, name) {
                    
                    var res = this.compareTopics(topic, actor.topic)
                    
                    t.ok(res, "Actor's [" + actor.name + "] state has been correctly converged")
                    
                    if (!res) failedActor = actor
                })
                
                if (failedActor) {
                    
                    this.compareTopicsSequentially(this.actors.actor1, failedActor)
                    
//                    var actor1      = this.actors.actor1
//                    
//                    var res         = this.compareTopics(topic, failedActor.topic)
//                    
//                    actor1.unapplyAll()
//                    failedActor.unapplyAll()
//                    
//                    
//                    actor1.applyAll()
//                    failedActor.applyAll()
//                    
////                    debugger
//                    
//                    var res = this.compareTopics(topic, failedActor.topic)
//                    
//                    t.ok(res, "After unapply/applyAll state converged")
                }
                
                this.CONTINUE()
            }
            // eof verify
        }
    }

})
