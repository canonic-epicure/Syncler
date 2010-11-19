Role('Syncler.PubSub.Faye', {
    
    requires    : [ 'getFayeClient' ],
    
    
    use         : 'Data.UUID',
    
    
    has : {
        pubsubUUID                    : function () { return Data.UUID.uuid() }
    },
    

    methods : {
        
        subscribe : function (replica, func, scope) {
            var me = this
            
            return this.getFayeClient().subscribe(replica, function (wrapper) {
                
                if (wrapper.sender == me.pubsubUUID) return
                
                func.call(scope || me, wrapper.message, wrapper)
            })
        },
        
        
        subscribeRaw : function (replica, func, scope) {
            return this.getFayeClient().subscribe(replica, func, scope)
        },
        
        
        publish : function (replica, message) {
            
            this.getFayeClient().publish(replica, {
                sender  : this.pubsubUUID,
                
                message : message
            })
        },
        
        
        publishRaw : function (replica, message) {
            
            this.getFayeClient().publish(replica, message)
        }
    }
})

