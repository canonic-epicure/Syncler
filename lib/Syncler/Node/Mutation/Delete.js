Class('Syncler.Node.Mutation.Delete', {
    
    isa     : 'Syncler.Node.Mutation',
    
    
    has : {
        objectUUID              : null
    },
    
    
    methods : {
        
        activate : function (channel) {
            
            channel.deleteObject(this.objectUUID)
        }
    }
})

