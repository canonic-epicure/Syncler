Class('Syncler.Node.Mutation.Update', {
    
    isa     : 'Syncler.Node.Mutation',
    
    
    has : {
        attributeName           : null,
        
        oldValue                : null,
        
        newValue                : null
    },
    
    
    methods : {
        
        activate : function (scope) {
            
//            var object      = channel.getObject(this.objectUUID)
//            var attribute   = object.meta.getAttribute(this.attributeName)
//            
//            var oldValue    = attribute.getRawValueFrom(object)
//            
//            if (oldValue != this.oldValue) throw "Incorrect mutation"
//            
//            attribute.setRawValueTo(object, this.newValue, true)
        }
    }
})

