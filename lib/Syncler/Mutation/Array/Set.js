Class('Syncler.Mutation.Array.Set', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        index           : { required : true },
        
        oldValue        : null,
        newValue        : { required : true }
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void()
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            object.value[ this.index ] = this.newValue
        },
        
        
        deRealize : function (replica) {
            var array      = this.getObjectFrom(replica).value
            
            array[ this.index ] = this.oldValue
        },
        
        
        savePrecondition : function (replica) {
            var array       = this.getObjectFrom(replica).value
            
            this.oldValue   = array[ this.index ]
        },
        
        
        checkPrecondition : function (replica) {
            if (!this.hasLiveInstance(replica, Syncler.Attribute.Array)) return false
            
            var object      = this.getObjectFrom(replica)
            var array       = object.value
            
            return this.index < array.length && array[ this.index ] === this.oldValue
        }
    }
})
