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
        
        
        apply : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            object[ this.index ] = this.newValue
        },
        
        
        unapply : function (replica) {
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
