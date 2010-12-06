Class('Syncler.Replica.Server', {
    
    isa     : 'Syncler.Replica',
    
    
    has : {
//        bufferedSave            : false,
//        saving                  : false,
        
        clients                 : Joose.I.Object,
        
        commitSeq               : 1,
        
        ready                   : false
    },
    
    
    after : {
        
        initialize : function () {
//            this.on('update-idle', this.saveTopic, this)
//            
//            this.on('update-raw-message', this.translateUpdate, this)
//            
//            this.on('update-exception', this.onUpdateException, this)
        }
    },
    
    
    methods : {
        
        onSocketConnect : function () {
//            if (this.isSettingUp) {
//                
//                var topic       = config.topic
//                
//                if (topic) 
//                    this.createTopic(topic)
//                else
//                    if (config.topicID)
//                        this.fetchTopic(config.topicID)
//                
//            }
        },
        
            
        onSocketMessage : function (message) {
//            if (this.isSettingUp) {
//                this.isSettingUp = false
//
//                var setupCONT = this.setupCONT
//                delete this.setupCONT
//                
//                if (message.type == 'createTopic-result') {
//                    setupCONT.CONTINUE(this)
//                    
//                    return
//                }
//                
//                
//                if (message.type == 'fetchTopic-result') {
//                    var me              = this
//                    
//                    // XXX switch to synchronous animation
//                    TRY(this.scope).animatePacket(topicPacket).then(function (object, array) {
//                        
//                        me.setTopic(array[0])
//                        
//                        setupCONT.CONTINUE(me)
//                        
//                    }).except(function (e) {
//                        
//                        setupCONT.THROW(e)
//                        
//                    }).now()
//                }
//            } else {
//                
//                if (message.type == 'commitOwnMutation') this.commitOwnMutation(message.acceptNum, message.commitNum)
//                
//                if (message.type == 'commitNewMutation') this.commitNewMutation(message.mutationPacket)
//            }
        },
        
            
        onSocketDisonnect : function () {
//            if (this.isSettingUp) {
//                this.isSettingUp = false
//                
//                var setupCONT = this.setupCONT
//                delete this.setupCONT
//                
//                setupCONT.THROW("Connection error")
//            }
        },
        
        
        commit : function (mutation) {
            mutation.commitNum = this.commitSeq++
            
            mutation.apply(this)
            
            this.committedQueue.push(mutation)
        },
        
        
        
        joinNewClient : function (client) {
            var scope = me.backend.newScope()
            
            scope.registerProxy(replica, 'replica:' + replica.getTopic().getTopicID())
            
            this.CONTINUE(scope.includeNewObjects({}, [ replica.getTopic() ]))
        },
        
        
        joinTopicCreator : function (client) {
        },
        
        
//        onUpdateException : function (me, e) {
////            console.log('UPDATE EXCEPTION: ' + e)
//        },
//        
//        
//        translateUpdate : function (me, wrapper) {
//            console.log('TRANSLATING UPDATE: ' + JSON2.stringify(wrapper))
//            
//            console.log('TOPIC REV: ' + this.scope.idToNode(this.topic.getTopicID()).REV)
//            
//            this.publishRaw(this.getOutGoingReplicaName(), wrapper)
//        },
//        
//        
//        saveTopic : function () {
//            console.log('GONNA SAVE THE TOPIC')
//            
//            var me      = this
//            
//            if (this.saving) {
//                this.bufferedSave = true
//                
//                return
//            }
//            
//            this.saving         = true
//            this.bufferedSave   = false
//            
//            
//            var processedQueue = this.processedQueue
//            
//            this.processedQueue = []
//            
//            var objects = []
//            
//            Joose.A.each(processedQueue, function (element) {
//                
//                Joose.A.each(element.mutations, function (mutation) {
//                    
//                    objects.push(mutation, mutation.object)
//                })
//            })
//            
//            TRY(function () {
//                
//                me.scope.storeObjects({
//                    
//                    wIDs        : {},
//                    woIDs       : objects,
//                    
//                    mode        : 'store',
//                    isShallow   : true
//                    
//                }).then(function () {
//                    
//                    console.log('TOPIC SAVED SUCCESSFULLY, REV: ' + me.scope.idToNode(me.topic.getTopicID()).REV)
//                    
////                    var scope = this.scope
////                    
////                    var ids = {}
////                    
////                    Joose.A.map(objects, function (object) {
////                        
////                        ids[ scope.objectToId(object) ] = true
////                    })
////                    
////                    var idsArray = []
////                    
////                    Joose.O.each(ids, function (value, id) {
////                        idsArray.push(id)
////                    })
////                    
////                    console.log('IDS: ' + JSON2.stringify(idsArray))
//                    
//                    this.CONTINUE()
//                    
//                }, me).except(function (e) {
//                    
//                    console.log('ERROR SAVING TOPIC: ' + e)
//                    
//                    this.CONTINUE()
//                
//                }).ensure(function () {
//                    
//                    me.saving = false
//                    
//                    if (me.bufferedSave) me.saveTopic()
//                    
//                }).now()
//                
//            }).now()
//        },
        
        
        onReady : function (callback) {
            this.on('ready', callback, this, { single : true })
            
            if (this.ready) this.fireEvent('ready', this)
        }
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function (config) {
                
                var me          = this
                var scope       = this.scope
                
                var topicPacket  = config.topicPacket
                
                // new topic from data packet
                if (topicPacket) {
                    
                    scope.registerProxy(this, 'replica:' + config.topicID)
                    
                    // XXX!!! switch to synchronous animation
                    scope.animatePacket(topicPacket).andThen(function (objects, array) {
                        
                        var topic       = array[0]
                        
                        me.setTopic(topic)
                        
                        // XXX implement `storePacket` or similar method 
                        scope.store(topic).andThen(function () {
                            
                            me.ready        = true
                            
                            me.fireEvent('ready', me)
                            
                            this.CONTINUE(me)
                        })
                    })
                    
                    return
                }
                
                var topicID     = config.topicID
                
                if (topicID) {
                    
                    scope.registerProxy(this, 'replica:' + topicID)
                    
                    
                    scope.lookUp(topicID).andThen(function (topic) {
                        
                        me.setTopic(topic)
                        
                        me.ready        = true
                        
                        me.fireEvent('ready', me)
                        
                        this.CONTINUE(me)
                    })
                    
                    return
                }
                
                throw "Incorrect arguments to `setup` method of [" + this + "]"
            }
        }
    }
    // eof continued
    
})