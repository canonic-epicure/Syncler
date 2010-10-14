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
            is      : 'rw'
        },
        
        internalQueue           : Joose.I.Array,
        incomingQueue           : Joose.I.Array,
        
        updating                : false
    },
    
    
    methods : {
        
        getChannelBaseName : function () {
            return '/channel/' + this.topic.getTopicID()
        },
        
        
        getPublishChannelName : function () {
            return this.getChannelBaseName() + '/update'
        },
        
        
        onVeroCommit : function (vero, packet) {
            this.internalQueue.push(packet)
            
            this.fireEvent('/channel/object/commit', this, vero.object, packet, vero)
        },
        
        
        commit : function () {
            var internalQueue = this.internalQueue
            
            if (internalQueue.length) {
            
                this.internalQueue      = []
                
                // packing the information about all mutations
                // it will include refs to old/new values, newly created objects, etc
                var packet = this.scope.includeNewObjects({}, internalQueue)
                
                this.publish(this.getPublishChannelName(), packet)
                
                this.fireEvent('/channel/commit', this, internalQueue)
            }
        },
        
        
        onUpdate : function (message) {
//            message = JSON2.parse(JSON2.stringify(message))
            
            this.incomingQueue.push(message)
            
            if (!this.updating) 
                this.processIncomingPacket()
            else
                console.log('Scheduled update: ' + this.incomingQueue.length)
        },
        
        
        subscribeOnUpdates : function () {
            this.subscribe(this.getUpdateChannel(), this.onUpdate, this)
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
        }
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function () {
            }
        }
    }
    // eof continued
})