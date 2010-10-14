Role('Syncler.PubSub.Faye', {
    
    requires    : [ 'getFayeClient' ],
    
    
    use         : 'Data.UUID',
    
    
    has : {
        pubsubUUID                    : function () { return Data.UUID.uuid() }
    },
    

    methods : {
        
        subscribe : function (channel, func, scope) {
            var me = this
            
            return this.getFayeClient().subscribe(channel, function (wrapper) {
                
                if (wrapper.sender == me.pubsubUUID) return
                
                func.call(scope || me, wrapper.message)
            })
        },
        
        
        publish : function (channel, message) {
            
            this.getFayeClient().publish(channel, {
                sender  : this.pubsubUUID,
                
                message : message
            })
        }
    }
})

