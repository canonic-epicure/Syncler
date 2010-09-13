Class('Syncler.Channel', {
    
    does        : [
        'JooseX.Observable'
    ],

    
    use : [
    ],
    
    
    has : {
        syncler                 : { required : true },
        scope                   : { required : true },
        
        channelName             : { 
            is      : 'rwc',
            
            lazy    : function () { 
                var topic = this.topic
                
                return '/' + topic.meta.name.replace(/\./g, '/') + topic.getUuid()
            } 
        },
        
        topic                   : {
            is      : 'rw'
        },
        
        queue                   : Joose.I.Array
    },
    
    
//    after : {
//        
//        initialize : function () {
//            
//            
//        }
//    },
    
    
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
            
            var scope       = this.scope
            var me          = this
            
            scope.registerProxy(this, 'channel:' + topic.getUuid())
            
            scope.store(topic).andThen(function (topicID) {
                
                me.subscribe(me.channelName(), me.onUpdate, me)    
            })
        },

        
//        registerVero : function (vero) {
//            // XXX cleanup the listener
//            vero.on('mutate', this.onObjectMutate, this)
//        },
        
        
        onObjectMutate : function (object, packet) {
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
                
                // gather only new nodes
                this.publish(this.channelName(), this.scope.includeNewObjects({}, queue))
            }
        },
        
        
        onUpdate : function (message) {
            var me = this
            
            var entries     = message.entries
            var packetIDs   = message.IDs
            
            this.scope.animateEntries(entries, packetIDs).andThen(function (result) {
                
                var packets = result[1]
                
                Joose.A.each(packets, function (packet) {
                    
                    packet.each(function (mutation) {
                        mutation.activate(me)
                    })
                    
                    me.fireEvent('mutation', packet.getObject(), packet, me)
                })
            })
        }
        
    }
})