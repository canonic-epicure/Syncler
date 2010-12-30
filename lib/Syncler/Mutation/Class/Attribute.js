Class('Syncler.Mutation.Class.Attribute', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        attributeName           : { required : true },
        
        hasOldValue             : false,
        oldValue                : null,
        
        newValue                : { required : true },
        
        label                   : 'attribute'
    },

    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void({ insteadOf : this })
        },
        
        
        // "setter" is being used, when mutation is being accepted from "live" code
        // otherwise we use side-effect-free `setRawValueTo` 
        realize : function (replica, setter) {
            var object      = this.getObjectFrom(replica)
            
            if (setter)
                setter.call(object, this.newValue)
            else
                object.meta.getAttribute(this.attributeName).setRawValueTo(object, this.newValue)
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            if (this.hasOldValue)
                attribute.setRawValueTo(object, this.oldValue)
            else
                attribute.clearValue(object) 
        },
        
        // object can be passed as 2nd argument for speed up
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
            
            return !this.hasOldValue || attribute.getRawValueFrom(object) === this.oldValue
        }
    }
})

