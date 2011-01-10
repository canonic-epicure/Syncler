Class('Syncler.Mutation.Object.Set', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        key             : { required : true },
        
        // should be equivalent to this.hasOwnProperty('oldValue'), refactor later, when test suite will pass
        hasOldValue     : false,
        oldValue        : null,
        newValue        : { required : true }
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void({ insteadOf : this })
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            object.value[ this.key ] = this.newValue
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica).value
            var key         = this.key
            
            if (this.hasOldValue)
                object[ key ] = this.oldValue
            else
                delete object[ key ] 
        },
        
        
        savePrecondition : function (replica) {
            var object      = this.getObjectFrom(replica).value
            var key         = this.key
            
            if (object.hasOwnProperty(key)) {
                this.hasOldValue    = true
                this.oldValue       = object[ key ]    
            } else
                this.hasOldValue    = false
        },
        
        
        checkPrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            return (object instanceof Syncler.Composite.Object) && (!this.hasOldValue || object.value[ this.key ] === this.oldValue)
        }
    }
})
