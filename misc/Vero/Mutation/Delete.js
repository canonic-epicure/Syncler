Class('Syncler.Vero.Mutation.Delete', {
    
    isa     : 'Syncler.Vero.Mutation',
    
    
    has : {
        objectUUID              : null
    },
    
    
    methods : {
        
        activate : function (channel) {
            
            channel.deleteObject(this.objectUUID)
        }
    }
})

