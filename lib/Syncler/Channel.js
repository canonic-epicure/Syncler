Class('Syncler.Channel', {
    
    trait   : 'JooseX.CPS',
    
    does        : [
        'JooseX.Observable',
        
        'Syncler.PubSub.Faye'
    ],

    
    has : {
        fayeClient              : {
            is          : 'rw',
            required    : true 
        },
        scope                   : { required : true },
        
        topic                   : {
            is          : 'rw'
        },
        
        incomingQueue           : Joose.I.Array,
        
        updating                : false
    },
    
    
    methods : {
        
        getChannelBaseName : function () {
            return '/channel/' + this.topic.getTopicID()
        },
        
        
        getIncomingChannelName : function () {
            return this.getChannelBaseName() + '/income'
        },
        
        
        onIncomingUpdate : function (message) {
//            message = JSON2.parse(JSON2.stringify(message)) // XXX can't modify `message` as it will be broadcasted further
            
            this.incomingQueue.push(message)
            
            this.processIncomingPacket()
        },
        
        
        processIncomingPacket : function () {
            if (this.updating) return
            
            this.updating = true
            
            var me          = this
            var message     = this.incomingQueue.shift()
            
            TRY(function () {
                
                me.scope.animatePacket(message).then(function (customIDs, packets) {
                    
                    Joose.A.each(packets, function (packet) {
                        
                        packet.each(function (mutation) {
                            mutation.activate(me)
                        })
                        
                        me.fireEvent('update-packet', me, packet.getObject(), packet)
                    })
                    
                    me.fireEvent('update-message', me, packets)
                    
                    this.CONTINUE()
                    
                }).except(function (e) {
                    
                    this.CONTINUE()
                    
                }).ensure(function () {
                    
                    me.updating = false
                    
                    if (me.incomingQueue.length) 
                        me.processIncomingPacket()
                    else
                        me.fireEvent('update-idle', me)
                    
                    this.CONTINUE()
                    
                }).now()
                
            }).now()
            
        }
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            subscribeOnIncomingUpdates : function () {
                this.subscribe(this.getIncomingChannelName(), this.onIncomingUpdate, this)
                
                this.CONTINUE()
            },
            
            
            establish : function (topic) {
                
                if (!topic.meta.does(Syncler.Vero.Role.Topic)) throw "Topic doesn't implement a `Syncler.Vero.Role.Topic` role"
                
                this.setTopic(topic)
                
                var scope       = this.scope
                var me          = this
                
                scope.registerProxy(this, 'channel:' + topic.getTopicID())
                
                scope.store(topic) // async
                    
                this.subscribeOnIncomingUpdates().andThen(function (topicID) {
                    
                    me.publish('/syncler/channel/new', { topicID : topicID })
                    
                    this.CONTINUE(me)
                })
            },
            
            
            fetchTopic : function (topicID) {
                
                var me          = this
                var scope       = this.scope
                
                scope.registerProxy(this, 'channel:' + topicID)
                
                this.subscribeOnIncomingUpdates() // async
                
                scope.getBackend().fetchTopic(topicID).andThen(function (topic) {
                    
                    me.setTopic(topic)
                    
                    this.CONTINUE(me)
                })
            }
        }
    }
    // eof continued
})