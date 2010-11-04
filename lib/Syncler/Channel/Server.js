Class('Syncler.Channel.Server', {
    
    isa     : 'Syncler.Channel',
    
    
    has : {
        saving                  : false,
        ready                   : false
    },
    
    
    after : {
        
        initialize : function () {
            this.on('update-idle', this.saveTopic, this)
            
            this.on('update-raw-message', this.translateUpdate, this)
            
            this.on('update-exception', this.onUpdateException, this)
        }
    },
    
    
    methods : {
        
        getOutGoingChannelName : function (topicID) {
            return this.getChannelBaseName(topicID) + '/income'
        },
        
        
        getIncomingChannelName : function (topicID) {
            return this.getChannelBaseName(topicID) + '/notify'
        },
        
        
        onUpdateException : function (me, e) {
            console.log('UPDATE EXCEPTION: ' + e)
        },
        
        
        translateUpdate : function (me, message) {
            console.log('TRANSLATING UPDATE: ' + JSON2.stringify(message))
            
            this.publishRaw(this.getOutGoingChannelName(), message)
        },
        
        
        saveTopic : function () {
            console.log('GONNA SAVE THE TOPIC')
            
            var processedQueue = this.processedQueue
            
            this.processedQueue = []
            
            var objects = []
            
            Joose.A.each(processedQueue, function (element) {
                
                Joose.A.each(element.mutations, function (mutation) {
                    
                    objects.push(mutation, mutation.object)
                })
            })
            
            this.scope.storeObjects({
                
                wIDs        : {},
                woIDs       : objects,
                
                mode        : 'store',
                isShallow   : true
                
            }).then(function () {
                
                console.log('TOPIC SAVED SUCCESSFULLY')
                
                var scope = this.scope
                
                var ids = {}
                
                Joose.A.map(objects, function (object) {
                    
                    ids[ scope.objectToId(object) ] = true
                })
                
                var idsArray = []
                
                Joose.O.each(ids, function (value, id) {
                    idsArray.push(id)
                })
                
                console.log('IDS: ' + JSON2.stringify(idsArray))
            }, this).except(function (e) {
                
                console.log('ERROR SAVING TOPIC: ' + e)
            }).now()
            
            
            
//            var me      = this
//            
//            if (this.saving) {
//            
//                console.log('Already saving topic, skipping')
//                
//                return
//            }
//            
//            this.saving = true
//            
//            console.log('Saving topic')
//            
//            this.scope.store(this.getTopic()).then(function () {
//                
//                console.log('Saved topic successfully')
//                
//                console.log('Topic rev: ' + me.scope.objectToNode(me.getTopic()).REV)
//                
//                this.CONTINUE()
//                
//            }).except(function (e) {
//                
//                console.log('Error during saving topic: ' + e)
//                
//                this.CONTINUE()
//            
//            }).ensure(function (e) {
//                
//                me.saving = false
//                
//                this.CONTINUE()
//                
//            }).now()
        },
        
        
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
                
                var dataPacket  = config.dataPacket
                
                // new topic from data packet
                if (dataPacket) {
                    
                    var topicID     = dataPacket.topicID
                    
                    scope.registerProxy(this, 'channel:' + topicID)
                    
                    scope.animatePacket(dataPacket.packet).andThen(function (objects, array) {
                        
                        var topic       = array[0]
                        
                        me.setTopic(topic)
                        
                        scope.store(topic) // async
                        
                        me.subscribeOnIncomingUpdates().andThen(function () {
                            me.ready        = true
                            
                            me.fireEvent('ready', me)
                            
                            this.CONTINUE(me)
                        })
                    })
                    
                    return
                }
                
                var topicID     = config.topicID
                
                if (topicID) {
                    
                    scope.registerProxy(this, 'channel:' + topicID)
                    
                    this.subscribeOnIncomingUpdates(topicID) // async
                    
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