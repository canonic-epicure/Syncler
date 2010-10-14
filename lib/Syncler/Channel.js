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
            
            var me = this
            
            this.updating = true
            
            var message = this.incomingQueue.shift()
            
            console.log('Starting update')
            
            TRY(function () {
                
                this.scope.animatePacket(message).then(function (customIDs, packets) {
                    
                    console.log('Update was successfull #1')
                    
                    Joose.A.each(packets, function (packet) {
                        
                        packet.each(function (mutation) {
                            mutation.activate(me)
                        })
                        
                        me.fireEvent('mutation', me, packet.getObject(), packet)
                    })
    
                    
                    me.fireEvent('update', me, packets)
                        
                    console.log('Update was successfull #2')
                    
                    this.CONTINUE()
                    
                }).except(function (e) {
                    
                    console.log('Error during packet animation: ' + e)
                    
                    this.CONTINUE()
                    
                }).ensure(function () {
                    
                    console.log('Reached ensure')
                    
                    me.updating = false
                    
                    if (me.incomingQueue.length) me.processIncomingPacket()
                    
                    console.log('Ensuring update internalQueue will works futher')
                    
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
            
            
            setup : function () {
                throw "Abstract method `setup` called for [ " + this + "]"
            }
        }
    }
    // eof continued
})