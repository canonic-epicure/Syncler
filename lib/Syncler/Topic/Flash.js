Class('Syncler.Topic.Flash', {
    
    isa : 'Syncler.Attribute.Object',
    
    
    after : {
        
        initialize : function () {
            
            this.on('/mutation/apply', function (e, mutation) {
                
                mutation.persistent     = false
            })
        }
    }
})