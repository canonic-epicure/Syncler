Role('Syncler.Vero.Role', {
    
    does        : 'JooseX.Observable',
    
    
    use : [ 
        'Syncler.Vero.Mutation.Delete'
    ],
    
    
    has : {
        VERO        : null,
        
        syncler     : null, // either of these 2
        hub         : null  // is required
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
    },
    
    
    override : {
        
        BUILD : function () {
            var args = this.SUPERARG(arguments)
            
            if (!args.hub && !args.syncler) throw "Either `syncler` of `hub` attribute is required for [" + this + "]"
            
            return args
        }
    }
    
})

