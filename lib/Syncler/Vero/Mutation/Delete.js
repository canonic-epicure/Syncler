Class('Syncler.Vero.Mutation.Delete', {
    
    isa     : 'Syncler.Vero.Mutation',
    
    
    has : {
    },
    
    
    methods : {
        
        activate : function (scope) {
            
            scope.deleteObject(this.object)
        }
    }
})

