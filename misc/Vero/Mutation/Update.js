Class('Syncler.Vero.Mutation.Update', {
    
    isa     : 'Syncler.Vero.Mutation',
    
    
    has : {
        objectUUID              : null,
        
        attributeName           : null,
        
        oldValue                : null,
        
        newValue                : null
    },
    
    
    methods : {
        
        activate : function (channel) {
            
            var object      = channel.getObject(this.objectUUID)
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            var oldValue    = attribute.getRawValueFrom(object)
            
            if (oldValue != this.oldValue) throw "Incorrect mutation"
            
            attribute.setRawValueTo(object, this.newValue, true)
        }
    }
})

