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

            
            return function (value) {
                
                var mutation = new Syncler.Vero.Mutation.Update({
                    
                    attributeName       : me.name,
                    
                    oldValue            : me.getRawValueFrom(this),
                    newValue            : value
                })
                
                var res = original.apply(this, arguments)
                
                this.VERO.addMutation(mutation)
                
                return res
            }
        }
    }
})

