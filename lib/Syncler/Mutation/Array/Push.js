Class('Syncler.Mutation.Array.Push', {
    
    does     : 'Syncler.Mutation',
    
    
    has : {
        newValues        : null
    },
    
    
    methods : {
        
        merge : function () {
        },
        
        
        apply : function (replica) {
            var object      = this.getObjectFrom(replica).value
            
            object.push.apply(object, this.newValues)
        },
        
        
        unapply : function (replica) {
            var object      = this.getObjectFrom(replica).value
            var length      = this.newValues.length
            
            object.splice(object.length - length + 1, length)
        },
        
        
        savePrecondition : function (replica) {
        },
        
        
        checkPrecondition : function (replica) {
            return this.getObjectFrom(replica) !== null
        }
    }
})
