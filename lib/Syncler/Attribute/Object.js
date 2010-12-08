Class('Syncler.Attribute.Object', {
    
    isa : 'Syncler.Attribute.Base',
    
    has : {
        value       : Joose.I.Object
    },
    
    
    methods : {
        
        get : function (index) {
//            return this.value[ index ]
        },
        
        
        set : function (key, newValue) {
//            var value       = this.value
//            var replica     = this.replica
//            
//            replica.acceptMutation(new Syncler.Mutation.Array.Set({
//                objectUUID  : replica.objectToID(value),
//                
//                index       : index,
//                oldValue    : value[ index ],
//                newValue    : newValue
//            }))
//            
//            value[ index ] = newValue
        },
        
        
        remove : function (key) {
        },
        
        
        count : function () {
        },
        
        
        length : function () {
        },
        
        
        keys : function () {
        },
        
        
        values : function () {
        },
        
        
        kv  : function () {
        },
        
        
        isEmpty  : function () {
        }
    }
})