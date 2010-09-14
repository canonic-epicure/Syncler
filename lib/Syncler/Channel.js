Class('Syncler.Channel', {
    
    trait   : 'JooseX.CPS',
    
    does        : [
        'JooseX.Observable'
    ],

    
//    use : [
//    ],
    
    
    has : {
        syncler                 : { required : true },
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
        
        lastMutatedAt           : null
    },
    
    
//    after : {
//        
//        initialize : function () {
//            
//            
//        }
//    },
    
    
    methods : {
        
        getUpdateChannel : function () {
            return this.channelName() + '/update'
        },
        
        
        registerVero : function (vero) {
        },
        
        
        onVeroCommit : function (object, packet) {
            this.queue.push(packet)
        },
        
        
        // XXX cleanup all subscriptions
        subscribe : function (channel, func, scope) {
            this.syncler.subscribe(channel, func, scope)
        },
        
        
        publish : function (channel, message) {
            this.syncler.publish(channel, message)
        },
        
        
        commit : function () {
            var queue = this.queue
            
            if (queue.length) {
            
                this.queue      = []
                
                this.touch()
                
                // gather only new nodes
                this.publish(this.getUpdateChannel(), this.scope.includeNewObjects({}, queue))
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
            
            this.scope.animatePacket(message).andThen(function (customIDs, packets) {
                
                Joose.A.each(packets, function (packet) {
                    
                    packet.each(function (mutation) {
                        mutation.activate(me)
                    })
                    
                    me.fireEvent('mutation', packet.getObject(), packet, me)
                })
            })
        },
        
        
        subscribeOnUpdates : function () {
            this.subscribe(this.getUpdateChannel(), this.onUpdate, this)
        }
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            establish : function (config) {
                
                if (config == Object(config) && config.topic) this.setTopic(config.topic)
                
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
                    
                    me.publish('/vero/channel/new', { topicID : topicID })
                    
//                    me.flush()
                    
                    me.subscribeOnUpdates()
                    
                    this.CONTINUE(me)
                })
            }
        }
    }
})