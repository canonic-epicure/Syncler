Role('Syncler.Vero.Role', {
    
    use : [ 
        'Syncler.Vero.Mutation.Delete'
    ],
    
    does    : 'Syncler.Observable',
    
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

