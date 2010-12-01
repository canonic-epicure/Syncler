Class('Syncler.Mutation.Object.Set', {
    
    does     : 'Syncler.Mutation',
    
    
    has : {
        index           : null,
        
        oldValue        : null,
        newValue        : null
    },
    
    
    methods : {
        
        activate : function (replica) {
        }
        
    }
})
