Role('Syncler.Object', {
    
    use : [ 
        'Syncler.Vero.Mutation.Delete'
    ],
    
    
    trait   : 'Syncler.Vero.Meta',
    
    does    : 'Syncler.Observable',
    
    
    has : {
        VERO        : null,
        
        replica     : { required : true }
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

