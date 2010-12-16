Class('Syncler.Mutation.Object.Remove', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    has : {
        key             : { required : true },
        
        oldValue        : null
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void()
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            delete object.value[ this.key ]
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            object.value[ this.key ] = this.oldValue
        },
        
        
        savePrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            this.oldValue   = object.value[ this.key ]
        },
        
        
        checkPrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            return (object instanceof Syncler.Attribute.Object) && object.value[ this.key ] == this.oldValue
        }
    }
})
