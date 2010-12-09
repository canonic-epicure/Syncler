Class('Syncler.Mutation.Class.Attribute', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        attributeName           : null,
        
        oldValue                : null,
        
        newValue                : null
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void()
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            attribute.setRawValueTo(object, this.newValue)
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            attribute.setRawValueTo(object, this.oldValue)
        },
        
        
        savePrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            this.oldValue   = attribute.getRawValueFrom(object)
        },
        
        
        checkPrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            if (!object) return false
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            return attribute.getRawValueFrom(object) == this.oldValue
        }
    }
})

