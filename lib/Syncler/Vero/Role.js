Role('Syncler.Vero.Role', {
    
    use : [ 
        'Syncler.Vero.Mutation.Delete'
    ],
    
    
    has : {
        VERO        : {
            handles : 'commit'
        },
        
        channel     : { required : true }
    },
    
    
    methods : {
        
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

