Role('Syncler.Vero.Attribute', {
    
    use     : 'Syncler.Vero.Mutation.Update',
    
    
    has : {
        is                      : 'rw',
        
        concurrency             : 'lastWin'  // the only supported value for now
    },
    

    override : {
        
        
        getSetter : function () {
            var original    = this.SUPER()
            
            var me = this

            
            return function (value, isExternal) {
                
                var mutation = new Syncler.Vero.Mutation.Update({
                    
                    attributeName       : me.name,
                    
                    oldValue            : me.getValueFrom(this),
                    newValue            : value,
                    
                    objectUUID          : instance.VERO.UUID // XXX move to Vero itself (all mutations of object will point to the same object naturally)
                })
                
                var res = original.apply(this, arguments)
                
                this.VERO.addMutation(mutation)
                
                return res
            }
        },
        
        
        setRawValueTo : function (instance, value, isExternal) {
            
            if (isExternal) {
                this.SUPER(instance, value)
                
                return
            }
            
            if (this.connection == 'strong' && Joose.O.isInstance(value) && value.meta.does('Syncler.Vero')) {
                
                
                
            }
            
            
            this.SUPER(instance, value)
            
            instance.VERO.addMutation(mutation)
        }
    }
})

