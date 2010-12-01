Role('Syncler.Object.Attribute', {
    
    does    : 'KiokuJS.Feature.Attribute.Extrinsic',
    
    use     : [
        'Syncler.Mutation.Class.Update'
    ],
    
    
    has : {
        is                      : 'rw'
    },
    

    override : {
        
        preApply : function (toClass) {
            if (!toClass.meta.does(Syncler.Object)) throw new Error("Can't apply attribute [" + this.name + "] to class [" + toClass + "] - missing Syncler.Object role")
            
        },
        
        
        // setters calls 'setRawValue' which will be overriden here?
        getSetter : function () {
            var original    = this.SUPER()
            var me          = this
            
            return function (value) {
                if (this.__IS_BEING_CREATED__) return original.apply(this, arguments) 
                    
                var oldValue = me.getRawValueFrom(this)
                
                var mutation = new Syncler.Mutation.Class.Update({
                    
                    object              : this,
                    
                    attributeName       : me.name,
                    
                    oldValue            : oldValue,
                    newValue            : value
                })
                
                var res = original.apply(this, arguments)
                
                this.replica.addMutation(mutation)
                
                return res
            }
        }
    }
})

