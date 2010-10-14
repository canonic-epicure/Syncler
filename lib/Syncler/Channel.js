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
        
        
        subscribeOnUpdates : function () {
            this.subscribe(this.getUpdateChannel(), this.onUpdate, this)
        }
        
    }
    // eof methods
})