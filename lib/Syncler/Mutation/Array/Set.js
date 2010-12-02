Class('Syncler.Mutation.Array.Set', {
    
    does     : 'Syncler.Mutation',
    
    
    has : {
        index           : null,
        
        oldValue        : null,
        newValue        : null
    },
    
    
    methods : {
        
        apply : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            object[ this.index ] = this.newValue
        },
        
        
        unapply : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            object[ this.index ] = this.oldValue
        },
        
        
        checkPrecondition : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            return object[ this.index ] == this.oldValue
        }
    }
})
