Class('Syncler.Mutation.Array.Push', {
    
    does     : 'Syncler.Mutation',
    
    
    has : {
        newValues        : null
    },
    
    
    methods : {
        
        apply : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            object.push.apply(object, this.newValues)
        },
        
        
        unapply : function (replica) {
            var object      = this.getObjectFrom(replica)
            var length      = this.newValues.length
            
            object.splice(object.length - length + 1, length)
        },
        
        
        checkPrecondition : function (replica) {
            return this.getObjectFrom(replica) !== null
        }
    }
})
