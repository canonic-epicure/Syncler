Role('Syncler.Object.Attribute', {
    
    does    : 'KiokuJS.Feature.Attribute.Extrinsic',
    
    use     : 'Syncler.Object.Mutation.Update',
    
    
    has : {
        is                      : 'rw',
        
        concurrency             : 'lastWin'  // the only supported value for now
    },
    

    override : {
        
        
        // setters calls 'setRawValue' which will be overriden here?
        getSetter : function () {
            var original    = this.SUPER()
            var me          = this
            
            return function (value) {
                
                var mutation = new Syncler.Object.Mutation.Update({
                    
                    object              : this,
                    
                    attributeName       : me.name,
                    
                    oldValue            : me.getRawValueFrom(this),
                    newValue            : value
                })
                
                var res = original.apply(this, arguments)
                
                this.VERO.addMutation(mutation)
                
                this.fireEvent('mutation', this, value, mutation)
                
                return res
            }
        }
    }
})

