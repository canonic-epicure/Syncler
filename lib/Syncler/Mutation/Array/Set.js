Class('Syncler.Mutation.Array.Set', {
    
    does     : 'Syncler.Mutation',
    
    
    has : {
        index           : null,
        
        oldValue        : null,
        newValue        : null
    },
    
    
    methods : {
        
        merge : function () {
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            object[ this.index ] = this.newValue
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            object[ this.index ] = this.oldValue
        },
        
        
        savePrecondition : function (replica) {
        },
        
        
        checkPrecondition : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            return object[ this.index ] == this.oldValue
        }
    }
})
