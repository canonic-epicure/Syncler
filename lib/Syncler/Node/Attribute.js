Role('Syncler.Node.Attribute', {
    
    use     : 'Syncler.Node.Mutation.Update',
    
    
    has : {
        is                      : 'rw',
        
        concurrency             : 'lastWin'  // the only supported value for now
    },
    

    override : {
        
        
        getSetter : function () {
            var original    = this.SUPER()
            
            var me = this

            
            return function (value, isExternal) {
                
                var mutation = new Syncler.Node.Mutation.Update({
                    
                    attributeName       : me.name,
                    
                    oldValue            : me.getValueFrom(this),
                    newValue            : value
                })
                
                var res = original.apply(this, arguments)
                
                this.NODE.addMutation(mutation)
                
                return res
            }
        }
    }
})

