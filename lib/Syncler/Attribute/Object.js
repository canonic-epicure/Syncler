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
//            var value   = this.value
//            
//            this.host.addMutation(new Syncler.Mutation.Array.Set({
//                object      : value,
//                
//                index       : index,
//                oldValue    : value[ index ],
//                newValue    : newValue
//            }))
//            
//            value[ index ] = newValue
        },
        
        
        remove : function (key) {
//            var value   = this.value
//            
//            this.host.addMutation(new Syncler.Mutation.Array.Set({
//                object      : value,
//                
//                index       : index,
//                oldValue    : value[ index ],
//                newValue    : newValue
//            }))
//            
//            value[ index ] = newValue
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