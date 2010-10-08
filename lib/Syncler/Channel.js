Class('Syncler.Channel', {
    
    trait   : 'JooseX.CPS',
    
    does        : [
        'JooseX.Observable'
    ],

    
//    use : [
//    ],
    
    
    has : {
        syncler                 : {
            handles     : [ 'subscribe', 'publish' ],
            
            required : true 
        },
        scope                   : { required : true },
        
        channelName             : { 
            is      : 'rwc',
            
            lazy    : function () { 
                var topic = this.topic
                
                return '/' + topic.meta.name.replace(/\./g, '/') + '/' + topic.getTopicID()
            } 
        },
        
        topic                   : {
            is      : 'rw'
        },
        
        queue                   : Joose.I.Array,
        
        incomingUpdateQueue     : Joose.I.Array,
        
        lastMutatedAt           : null,
        
        saving                  : false,
        updating                : false
    },
    
    
    methods : {
        
        getUpdateChannel : function () {
            return this.channelName() + '/update'
        },
        
        
        registerVero : function (vero) {
        },
        
        
        onVeroCommit : function (vero, packet) {
            this.queue.push(packet)
            
            this.fireEvent('/channel/object/commit', this, vero.object, packet, vero)
        },
        
        
        commit : function () {
            var queue = this.queue
            
            if (queue.length) {
            
                this.queue      = []
                
                this.touch()
                
                // gather only new nodes
                var packet = this.scope.includeNewObjects({}, queue)
                
                console.log('Channel commit: ' + JSON2.stringify(packet))
                
                this.publish(this.getUpdateChannel(), packet)
                
                this.fireEvent('/channel/commit', this, queue)
            }
        },
        
        
//        flush : function () {
//        },
        
        
        touch : function () {
            this.lastMutatedAt = new Date()
        },
        
        
        onUpdate : function (message) {
            var me = this
            
            this.touch()
            
            message = JSON2.parse(JSON2.stringify(message))
            
            console.log('Incoming update: ' + JSON2.stringify(message))
            console.log('Update queue: ' + this.incomingUpdateQueue.length)
            
            
            this.incomingUpdateQueue.push(message)
            
            if (!this.updating) 
                this.processIncomingPacket()
            else
                console.log('Scheduled update: ' + this.incomingUpdateQueue.length)
        },
        
        
        processIncomingPacket : function () {
            var me = this
            
            this.updating = true
            
            var message = this.incomingUpdateQueue.shift()
            
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
                
                if (me.incomingUpdateQueue.length) 
                    setTimeout(function () { 
                        me.processIncomingPacket()
                    }, 0)
                
                console.log('Ensuring update queue will works futher')
                
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
                    var queue   = this.queue    
                    
                    if (!queue.length) throw "Can't determine a topic for [" + this + "]"
                    
                    topic = queue[0].mutations[0].object
                    
                    this.setTopic(topic)
                }
                
                if (!topic.meta.does(Syncler.Vero.Role.Topic)) throw "Topic doesn't implement a `Syncler.Vero.Role.Topic` role"
                
                var scope       = this.scope
                var me          = this
                
                scope.registerProxy(this, 'channel:' + topic.getTopicID())
                
                me.queue = []
                
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