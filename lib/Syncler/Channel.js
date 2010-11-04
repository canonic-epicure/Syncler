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
        
        updating                : false
    },
    
    
    methods : {
        
        getChannelBaseName : function (topicID) {
            return '/channel/' + (topicID || this.topic.getTopicID())
        },
        
        
        getIncomingChannelName : function (topicID) {
            return this.getChannelBaseName(topicID) + '/income'
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
                
                me.scope.animatePacket(message).then(function (customIDs, mutations) {
                    
                    mutations.each(function (mutation) {
                        mutation.activate(me)
                        
                        me.fireEvent('mutation', me, mutation.object, mutation)
                    })
                    
                    me.processedQueue.push(message)
                    
                    me.fireEvent('update-message', me, mutations)
                    
                    this.CONTINUE()
                    
                }).except(function (e) {
                    
                    me.fireEvent('update-exception', me, e)
                    
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