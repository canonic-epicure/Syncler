Class('Syncler.Mutation.Array.Set', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        index           : { required : true },
        
        oldLength       : null,
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
            array.length        = this.oldLength
        },
        
        
        savePrecondition : function (replica) {
            var array       = this.getObjectFrom(replica).value
            
            this.oldValue   = array[ this.index ]
            this.oldLength  = array.length
        },
        
        
        checkPrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            return (object instanceof Syncler.Attribute.Array) && object.value[ this.index ] == this.oldValue
        }
    }
})
