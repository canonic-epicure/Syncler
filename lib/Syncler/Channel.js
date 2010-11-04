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
        processedQueue          : Joose.I.Array,
        
        updating                : false,
        idleTimeout             : null,
        idleBuffer              : 500
    },
    
    
    methods : {
        
        getChannelBaseName : function (topicID) {
            return '/channel/' + (topicID || this.topic.getTopicID())
        },
        
        
        getIncomingChannelName : function (topicID) {
            return this.getChannelBaseName(topicID) + '/income'
        },
        
        
        onIncomingUpdate : function (message, wrapper) {
//            message = JSON2.parse(JSON2.stringify(message)) // XXX can't modify `message` as it will be broadcasted further
            
            console.log('INCOMING UPDATE by [' + this.pubsubUUID + ']: ' + JSON2.stringify(wrapper))
            
            this.incomingQueue.push(wrapper)
            
            this.processIncomingPacket()
        },
        
        
        processIncomingPacket : function () {
            var me          = this
            
            if (me.updating) return
            
            me.updating = true
            
            
            if (me.idleTimeout) {
                clearTimeout(me.idleTimeout)
                
                delete me.idleTimeout
            }
            
            var wrapper     = me.incomingQueue.shift()
            
            TRY(function () {
                
                me.scope.animatePacket(wrapper.message).then(function (customIDs, mutations) {
                    
                    Joose.A.each(mutations, function (mutation) {
                        mutation.activate(me)
                        
                        me.fireEvent('mutation', me, mutation.object, mutation)
                    })
                    
                    me.processedQueue.push({
                        wrapper     : wrapper,
                        mutations   : mutations
                    })
                    
                    me.fireEvent('update-raw-message', me, wrapper)
                    me.fireEvent('update-packet', me, mutations)
                    
                    this.CONTINUE()
                    
                }).except(function (e) {
                    
                    me.fireEvent('update-exception', me, e)
                    
                    this.CONTINUE()
                    
                }).ensure(function () {
                    
                    me.updating = false
                    
                    if (me.incomingQueue.length) 
                        me.processIncomingPacket()
                    else
                        me.idleTimeout = setTimeout(function () {
                            delete me.idleTimeout
                            
                            if (!me.updating) me.fireEvent('update-idle', me)
                        
                        }, me.idleBuffer)
                    
                    this.CONTINUE()
                    
                }).now()
                
            }).now()
            
        }
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            subscribeOnIncomingUpdates : function (topicID) {
                this.subscribe(this.getIncomingChannelName(topicID), this.onIncomingUpdate, this)
                
                this.CONTINUE()
            },
            
            
            setup : function () {
                throw "Abstract method `setup` called for [" + this + "]" 
            }
        }
    }
    // eof continued
})