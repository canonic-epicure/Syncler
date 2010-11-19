Class('Syncler.Vero.Mutation.Update', {
    
    isa     : 'Syncler.Vero.Mutation',
    
    
    has : {
        attributeName           : null,
        
        oldValue                : null,
        
        newValue                : null
    },
    
    
    methods : {
        
        activate : function (replica) {
            
            var object      = this.object
            
            var attribute   = object.meta.getAttribute(this.attributeName)
            
            // XXX naive consistency check
            if (attribute.concurrency != 'lastWin') {
                var oldValue    = attribute.getRawValueFrom(object)
                
                if (oldValue != this.oldValue) throw "Incorrect mutation"
            }
            
            attribute.setRawValueTo(object, this.newValue)
            
            object.fireEvent('mutation', object, this.newValue, this)
        }
    }
})

