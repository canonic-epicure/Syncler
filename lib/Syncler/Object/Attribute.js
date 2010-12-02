Role('Syncler.Object.Attribute', {
    
    does    : 'KiokuJS.Feature.Attribute.Extrinsic',
    
    use     : [
        'Syncler.Mutation.Class.Attribute'
    ],
    
    
    has : {
        is                      : 'rw'
    },
    

    before : {
        
        preApply : function (toClass) {
            if (!toClass.meta.does(Syncler.Object)) throw new Error("Can't apply attribute [" + this.name + "] to class [" + toClass + "] - missing Syncler.Object role")
        }
    },
        
        
    override : {
        
        // setters calls 'setRawValue' which will be overriden here?
        getSetter : function () {
            var original    = this.SUPER()
            var me          = this
            
            return function (value) {
                    
                var oldValue    = me.getRawValueFrom(this)
                var replica     = this.replica
                
                var mutation    = new Syncler.Mutation.Class.Attribute({
                    
                    object              : this,
                    
                    attributeName       : me.name,
                    
                    oldValue            : oldValue,
                    newValue            : value
                })
                
                var res = original.apply(this, arguments)
                
                replica.addMutation(mutation)
                
                return res
            }
        }
    }
})

