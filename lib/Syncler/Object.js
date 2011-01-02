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
        
        getBubbleTarget : function () {
            return this.replica
        },
        
        
        set : function (name, value) {
            if (typeof name != 'string') 
            
            return this.write({
                type        : 'Syncler.Mutation.Class.Attribute'
            })
        },
        
        
        write : function (spec) {
            spec.object = this
            
            return this.replica.write(spec)
        }
        
        
//        destroy : function () {
//            this.replica.addMutation(new Syncler.Object.Mutation.Delete({
//                object  : this
//            }))
//        }
    }
})