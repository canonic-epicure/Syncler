Role('Syncler.Object.Attribute', {
    
    does    : 'KiokuJS.Feature.Attribute.Extrinsic',
    
    use     : [
        'Syncler.Mutation.Class.Attribute',
        'KiokuJS.Feature.Attribute.Skip'
    ],
    
    
    has : {
        is                      : 'rw'
    },
    

    before : {
        
        preApply : function (toClass) {
            if (this.meta.does(KiokuJS.Feature.Attribute.Skip)) return
            
            if (!toClass.meta.meta.does(Syncler.Object.Meta)) throw new Error("Can't apply attribute [" + this.name + "] to class [" + toClass + "] - missing Syncler.Object.Meta trait")
        }
    },
        
        
    override : {
        
        // setters calls 'setRawValue' which will be overriden here?
        getSetter : function () {
            var original    = this.SUPER()
            var me          = this
            
            return function (value) {
                
                if (this.__IS_BEING_CREATED__) return original.apply(this, arguments)
                    
                var oldValue    = me.getRawValueFrom(this)
                var replica     = this.replica
                
                var mutation    = new Syncler.Mutation.Class.Attribute({
                    
                    objectID            : replica.objectToId(this),
                    
                    attributeName       : me.name,
                    
                    hasOldValue         : me.hasValue(this),
                    oldValue            : oldValue,
                    newValue            : value
                })
                
                original.apply(this, arguments)
                
                replica.acceptMutation(mutation)
                
                this.fireEvent('mutation-attribute', this, value, mutation.hasOldValue, mutation.oldValue)
                
                return mutation
            }
        }
    }
})

