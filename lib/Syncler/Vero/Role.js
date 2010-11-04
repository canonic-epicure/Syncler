Role('Syncler.Vero.Role', {
    
    use : [ 
        'Syncler.Vero.Mutation.Delete'
    ],
    
    
    has : {
        VERO        : null,
        
        channel     : { required : true }
    },
    
    
    methods : {
        
        // XXX do cleanup ?
        destroy : function () {
            this.VERO.addMutation(new Syncler.Vero.Mutation.Delete({
                object  : this
            }))
        }
    }
    
    
})

