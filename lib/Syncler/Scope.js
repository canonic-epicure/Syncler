Class('Syncler.Scope', {
    
    isa         : 'KiokuJS.Scope',
    
    does        : 'JooseX.Observable',

    
    use : [
    ],
    
    
    has : {
        channelName             : { 
            is      : 'rwc',
            
            lazy    : function () { 
                return '/' + this.hub.meta.name.replace(/\./g, '/') + this.objectToID(this.hub)  
            } 
        },
        
        hub                     : null,
        
        queue                   : Joose.I.Array
    },
    
    
    after : {
        
        initialize : function () {
            
            
        }
    },
    
    
    methods : {
        
        setup : function () {
            this.store(this.hub).andThen(function (hubID) {
                
                this.subscribe(this.channelName(), this.onUpdate, this)    
            })
        },
        
        
        getFayeClient : function () {
            return this.backend.fayeClient
        },
        
        
        registerVero : function (vero) {
            // XXX cleanup the listener
            vero.on('mutate', this.onObjectMutate, this)
        },
        
        
        onObjectMutate : function (object, packet) {
            this.queue.push(packet)
        },
        
        
        // XXX cleanup all subscriptions
        subscribe : function (channel, func, scope) {
            this.backend.subscribe(channel, func, scope)
        },
        
        
        publish : function (channel, message) {
            this.backend.publish(channel, message)
        },
        
        
        
        commit : function () {
            var queue = this.queue
            
            if (queue.length) {
            
                this.queue      = []
                
                // gather only new nodes
                this.publish(this.channelName(), this.includeNewObjects({}, queue))
            }
        },
        
        
        onUpdate : function (message) {
            var me = this
            
            var entries     = message.entries
            var packetIDs   = message.packetIDs
            
            this.animateEntries(entries, packetIDs).andThen(function (packets) {
                
                Joose.A.each(packets, function (packet) {
                    
                    packet.each(function (mutation) {
                        mutation.activate(me)
                    })
                    
                    channel.fireEvent('mutation', channel.getObject(UUID), packet, channel)
                })
            })
        }
        
    }
    
})