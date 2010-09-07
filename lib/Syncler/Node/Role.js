Role('Syncler.Node.Role', {
    
//    does        : 'JooseX.Observable',
    
    
    use : [ 
        'Syncler.Node.Mutation.Delete'
    ],
    
    
    has : {
        NODE        : null,
        
        scope       : { required : true }
    },
    
    
    methods : {
        
        commit : function () {
            this.NODE.commit()
        },
        
        
        mutate : function (func) {
            this.commit()
            
            func.call(this)
            
            this.commit()
        },
        
        
        // XXX do cleanup ?
        destroy : function () {
            this.NODE.addMutation(new Syncler.Node.Mutation.Delete())
        }
    }
    
    
})

