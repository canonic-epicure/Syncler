Role('Syncler.Vero.Attribute', {
    
    use     : 'Syncler.Vero.Mutation.Update',
    
    
    has : {
        is                      : 'rw',
        
        concurrency             : 'lastWin'  // the only supported value for now
    },
    
    
    override : {
        
        setRawValueTo : function (instance, value, isExternal) {
            
            if (isExternal) {
                this.SUPER(instance, value)
                
                return
            }
            
            if (this.connection == 'strong' && Joose.O.isInstance(value) && value.meta.does('Syncler.Vero')) {
                
                
                
            }
            
            var mutation = new Vero.Mutation.Update({
                
                attributeName       : this.name,
                
                oldValue            : this.getRawValueFrom(instance),
                newValue            : value,
                
                objectUUID          : instance.VERO.UUID // XXX move to Vero itself (all mutations of object will point to the same object naturally)
            })
            
            this.SUPER(instance, value)
            
            instance.VERO.addMutation(mutation)
        }
    }
})

