Class('Syncler.Channel', {
    
    trait   : 'JooseX.CPS',
    
    does        : [
        'JooseX.Observable',
        'Syncler.PubSub.Faye'
    ],

    
//    use : [
//    ],
    
    
    has : {
        fayeClient              : {
            is          : 'rw',
            required    : true 
        },
        scope                   : { required : true },
        
        topic                   : {
            is      : 'rw'
        },
        
        internalQueue           : Joose.I.Array,
        incomingQueue           : Joose.I.Array,
        
        lastMutatedAt           : null,
        
        saving                  : false,
        updating                : false
    },
    
    
    methods : {
        
        getChannelName : function () {
            return '/channel/' + this.topic.getTopicID()
        },
        
        
        getUpdateChannel : function () {
            return this.getChannelName() + '/update'
        },
        
        
        touch : function () {
            this.lastMutatedAt = new Date()
        },
        
        
        registerVero : function (vero) {
        },
        
        
        onVeroCommit : function (vero, packet) {
            this.internalQueue.push(packet)
            
            this.fireEvent('/channel/object/commit', this, vero.object, packet, vero)
        },
        
        
        commit : function () {
            var internalQueue = this.internalQueue
            
            if (internalQueue.length) {
            
                this.internalQueue      = []
                
                this.touch()
                
                // gather only new nodes
                var packet = this.scope.includeNewObjects({}, internalQueue)
                
                console.log('Channel commit: ' + JSON2.stringify(packet))
                
                this.publish(this.getUpdateChannel(), packet)
                
                this.fireEvent('/channel/commit', this, internalQueue)
            }
        },
        
        
//        flush : function () {
//        },
        
        
        onUpdate : function (message) {
            var me = this
            
            this.touch()
            
            message = JSON2.parse(JSON2.stringify(message))
            
            console.log('Incoming update: ' + JSON2.stringify(message))
            console.log('Update internalQueue: ' + this.incomingQueue.length)
            
            
            this.incomingQueue.push(message)
            
            if (!this.updating) 
                this.processIncomingPacket()
            else
                console.log('Scheduled update: ' + this.incomingQueue.length)
        },
        
        
        processIncomingPacket : function () {
            var me = this
            
            this.updating = true
            
            var message = this.incomingQueue.shift()
            
            console.log('Starting update')
            
            this.scope.animatePacket(message).then(function (customIDs, packets) {
                
                console.log('Update was successfull #1')
                
                Joose.A.each(packets, function (packet) {
                    
                    packet.each(function (mutation) {
                        mutation.activate(me)
                    })
                    
                    me.fireEvent('mutation', me, packet.getObject(), packet)
                })

                
                setTimeout(function () { 
                    me.fireEvent('update', me, packets)
                }, 0)
                
                console.log('Update was successfull #2')
                
                this.CONTINUE()
                
            }).except(function (e) {
                
                console.log('Error during packet animation: ' + e)
                
                this.CONTINUE()
                
            }).ensure(function () {
                
                console.log('Reached ensure')
                
                me.updating = false
                
                if (me.incomingQueue.length) 
                    setTimeout(function () { 
                        me.processIncomingPacket()
                    }, 0)
                
                console.log('Ensuring update internalQueue will works futher')
                
                this.CONTINUE()
                
            }).now()
        },
        
        
        subscribeOnUpdates : function () {
            this.subscribe(this.getUpdateChannel(), this.onUpdate, this)
        },
        
        
        saveTopic : function () {
            var me      = this
            
            if (this.saving) {
            
                console.log('Already saving topic, skipping')
                
                return
            }
            
            this.saving = true
            
            console.log('Saving topic')
            
            this.scope.store(this.getTopic()).then(function () {
                
                console.log('Saved topic successfully')
                
                console.log('Topic rev: ' + me.scope.objectToNode(me.getTopic()).REV)
                
                this.CONTINUE()
                
            }).except(function (e) {
                
                console.log('Error during saving topic: ' + e)
                
                this.CONTINUE()
            
            }).ensure(function (e) {
                
                me.saving = false
                
                this.CONTINUE()
                
            }).now()
        }
        
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            establish : function (config) {
                
                if (config === Object(config) && config.topic) this.setTopic(config.topic)
                
                var topic       = this.getTopic()
                
                if (!topic) {
                    var internalQueue   = this.internalQueue    
                    
                    if (!internalQueue.length) throw "Can't determine a topic for [" + this + "]"
                    
                    topic = internalQueue[0].mutations[0].object
                    
                    this.setTopic(topic)
                }
                
                if (!topic.meta.does(Syncler.Vero.Role.Topic)) throw "Topic doesn't implement a `Syncler.Vero.Role.Topic` role"
                
                var scope       = this.scope
                var me          = this
                
                scope.registerProxy(this, 'channel:' + topic.getTopicID())
                
                me.internalQueue = []
                
                scope.store(topic).andThen(function (topicID) {
                    
//                    me.flush()
                    
                    
                    me.subscribeOnUpdates()
                    
                    me.publish('/vero/channel/new', { topicID : topicID })
                    
                    this.CONTINUE(me)
                })
            }
        }
    }
})