Role('Syncler.Object', {
    
//    use : [ 
//        'Syncler.Object.Mutation.Delete'
//    ],
    
    
    trait   : 'Syncler.Object.Meta',
    
    does    : [
        'Syncler.Observable'
    ],
    
    
    has : {
        replica     : { required    : true }
    },
    
    
    methods : {
        
        set : function () {
        },
        
        
        write : function () {
        }
        
        
//        destroy : function () {
//            this.replica.addMutation(new Syncler.Object.Mutation.Delete({
//                object  : this
//            }))
//        }
    }
})