Class('Syncler.Vero.Channel', {
    
    meta        : Joose.Meta.Class,
    
    isa         : Ext.util.Observable,
    
    
    use : [
        {
            token       : 'ShareBoard/static/deps/faye/faye-browser.js',
            presence    : 'Faye'
        }
    ],
    
    
    
    has : {
        fayeClient              : null,
        uuid                    : Joose.I.UUID,
        
        url                     : null,
        options                 : null,
        
        scope                   : Joose.I.Object,
        
        filterOwnMessages       : true,
        
        queue                   : Joose.I.Array
    },
    
    
    methods : {
        
        initialize : function () {
            this.addEvents('newObject', 'mutation', 'message')
            
            this.fayeClient = new Faye.Client(this.url, this.options)
            
            this.subscribe('/update', this.onUpdate, this)
        },
        
        
        register : function (vero) {
            this.scope[ vero.UUID ] = vero
            
            vero.on('mutate', this.onObjectMutate, this)
        },
        
        
        onObjectMutate : function (object, packet) {
            this.queue.push(packet)
        },
        
        
        // XXX cleanup all subscriptions
        subscribe : function (channel, func, scope) {
            var me = this
            
            this.fayeClient.subscribe(channel, function (wrapper) {
                
                if (me.filterOwnMessages && wrapper.sender == me.uuid) return
                
                func.call(scope || me, me, wrapper.message)
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
            var queue = this.queue
            
            if (queue.length) {
            
                this.queue = []
                
                var mutationsAsObjects = Joose.A.map(queue, function (packet) {
                    
                    return Joose.A.map(packet, function (mutation) { 
                        return mutation.asObject() 
                    }) 
                })
                
                this.publish('/update', mutationsAsObjects)
            }
        },
        
        
        getObject : function (uuid) {
            var vero = this.scope[ uuid ]
            
            return vero && vero.object
        },
        
        
        onUpdate : function (channel, message) {
            var me = this
            
            Joose.A.each(message, function (packet) {
                
                var UUID = packet[0].data.objectUUID    
                
                Joose.A.each(packet, function (mutationData) {
                    
                    var mutationClass   = eval(mutationData.className)
                    var mutation        = new mutationClass(mutationData.data)
                    
                    mutation.activate(me)
                })
                
                channel.fireEvent('mutation', channel.getObject(UUID), packet, channel)
            })
        }
    }
})

