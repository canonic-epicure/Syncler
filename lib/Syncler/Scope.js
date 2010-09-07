Class('Syncler.Scope', {
    
    isa         : 'KiokuJS.Scope',
    
    does        : 'JooseX.Observable',

    
    use : [
        {
            token       : 'ShareBoard/static/deps/faye/faye-browser.js',
            presence    : 'Faye'
        }
    ],
    
    
    has : {
        fayeClient              : null,
        channelName             : null,
        
        fayeURL                 : { required : true },
        
        queue                   : Joose.I.Array,
        
        uuid                    : Joose.I.UUID
    },
    
    
    after : {
        
        initialize : function () {
            this.addEvents('newObject', 'mutation', 'message')
            
            this.fayeClient = new Faye.Client(this.fayeURL)
            
            this.subscribe(this.channelName, this.onUpdate, this)
        }
    },
    
    
    methods : {
        
        pinNode : function (node) {
            this.SUPER(node)
            
            // XXX cleanup the listener
            node.on('mutate', this.onObjectMutate, this)
        },
        
        
        onObjectMutate : function (object, packet) {
            this.queue.push(packet)
        },
        
        
        // XXX cleanup all subscriptions
        subscribe : function (channel, func, scope) {
            var me = this
            
            this.fayeClient.subscribe(channel, function (wrapper) {
                
                if (wrapper.sender == me.uuid) return
                
                func.call(scope || me, wrapper.message)
            })
        },
        
        
        publish : function (channel, message) {
            
            var wrapper = {
                sender  : this.uuid,
                
                message : message
            }
            
            this.fayeClient.publish(channel, wrapper)
        },
        
        
        commit : function () {
//            var queue = this.queue
//            
//            if (queue.length) {
//            
//                this.queue = []
//                
//                var mutationsAsObjects = Joose.A.map(queue, function (packet) {
//                    
//                    return Joose.A.map(packet, function (mutation) { 
//                        return mutation.asObject() 
//                    }) 
//                })
//                
//                this.publish('/update', mutationsAsObjects)
//            }
        },
        
        
        onUpdate : function (message) {
            var me = this
            
//            Joose.A.each(message, function (packet) {
//                
//                var UUID = packet[0].data.objectUUID    
//                
//                Joose.A.each(packet, function (mutationData) {
//                    
//                    var mutationClass   = eval(mutationData.className)
//                    var mutation        = new mutationClass(mutationData.data)
//                    
//                    mutation.activate(me)
//                })
//                
//                channel.fireEvent('mutation', channel.getObject(UUID), packet, channel)
//            })
        }
        
        
    }
    
})