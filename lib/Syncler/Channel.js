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
        
        saving                  : false,
        updating                : false
    },
    
    
    methods : {
        
        getChannelName : function () {
            return '/channel/' + this.topic.getTopicID()
        },
        
        
        getPublishUpdateChannel : function () {
            return this.getChannelName() + '/update'
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
                
                this.publish(this.getUpdateChannel(), packet)
                
                this.fireEvent('/channel/commit', this, internalQueue)
            }
        },
        
        
        onUpdate : function (message) {
//            message = JSON2.parse(JSON2.stringify(message))
//            
//            console.log('Incoming update: ' + JSON2.stringify(message))
//            console.log('Update internalQueue: ' + this.incomingQueue.length)
            
            
            this.incomingQueue.push(message)
            
            if (!this.updating) 
                this.processIncomingPacket()
            else
                console.log('Scheduled update: ' + this.incomingQueue.length)
        },
        
        
        subscribeOnUpdates : function () {
            this.subscribe(this.getUpdateChannel(), this.onUpdate, this)
        }
        
    }
    // eof methods
})