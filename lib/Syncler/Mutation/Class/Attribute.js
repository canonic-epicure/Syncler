Class('Syncler.Mutation.Class.Attribute', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        attributeName           : { required : true },
        
        hasOldValue             : false,
        oldValue                : null,
        
        newValue                : { required : true }
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void()
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            attribute.setRawValueTo(object, this.newValue)
            
            object.fireEvent('mutation-attribute', object, this.newValue, this.hasOldValue, this.oldValue)
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            if (this.hasOldValue)
                attribute.setRawValueTo(object, this.oldValue)
            else
                attribute.clearValue(object) 
        },
        
        
        savePrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            if (attribute.hasValue(object)) {
                this.hasOldValue    = true
                this.oldValue       = attribute.getRawValueFrom(object)    
            } else
                this.hasOldValue    = false
        },
        
        
        checkPrecondition : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            if (!object) return false
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            // === to prevent [ x ] == xx matching 
            return !this.hasOldValue || attribute.getRawValueFrom(object) === this.oldValue
        }
    }
})

