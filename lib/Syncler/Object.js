Role('Syncler.Object', {
    
    use : [ 
        'Syncler.Object.Mutation.Delete'
    ],
    
    
    trait   : 'Syncler.Object.Meta',
    
    does    : 'Syncler.Observable',
    
    
    has : {
        replica     : { 
            handles : {
                commit  : 'commitCurrentOp'
            },
            required : true 
        }
    },
    
    
    methods : {
        
        write : function (arg) {
            if (typeof arg == 'function') arg = {
                
                pre     : 'auto',
                merge   : 'void',
                
                mutate  : arg         
            }
            
            this.replica.write(arg)
        },
        
        
        destroy : function () {
            this.replica.addMutation(new Syncler.Object.Mutation.Delete({
                object  : this
            }))
        }
    }
    
    
})

