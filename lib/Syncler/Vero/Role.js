Role('Syncler.Vero.Role', {
    
//    does        : 'JooseX.Observable',
    
    
    use : [ 
        'Syncler.Vero.Mutation.Delete'
    ],
    
    
    has : {
        VERO        : null,
        
        scope       : {
            trait       : KiokuJS.Feature.Attribute.Skip,
            
            required : true 
        }
    },
    
    
    methods : {
        
        commit : function () {
            this.VERO.commit()
        },
        
        
        mutate : function (func) {
            this.commit()
            
            func.call(this)
            
            this.commit()
        },
        
        
        // XXX do cleanup ?
        destroy : function () {
            this.VERO.addMutation(new Syncler.Vero.Mutation.Delete())
        }
    }
    
    
})

