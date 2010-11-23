Role('Syncler.Object', {
    
    use : [ 
        'Syncler.Object.Mutation.Delete'
    ],
    
    
    trait   : 'Syncler.Object.Meta',
    
    does    : 'Syncler.Observable',
    
    
    has : {
        replica     : { 
            handles : {
                commit      : 'commitCurrentOp',
                write       : 'write'
            },
            required : true 
        }
    },
    
    
    methods : {
        
        destroy : function () {
            this.replica.addMutation(new Syncler.Object.Mutation.Delete({
                object  : this
            }))
        }
    }
})