Class('Syncler.Node.Mutation', {
    
    has : {
        timestamp               : Joose.I.Date,
        uuid                    : Joose.I.UUID, // overkill? compact uuid (base91)
        
        state                   : 'transient',
        
        creator                 : null,
        
        node                    : { required : true }
    },
    
    
    methods : {
        
        activate : function (scope) {
        }
        
//        ,
//        asObject : function () {
//            var obj = {
//                className   : this.meta.name,
//                data        : {}
//            }
//            
//            var me = this
//            
//            this.meta.getAttributes().each(function (attribute, name) {
//                obj.data[ name ] = attribute.getRawValueFrom(me)
//            })
//            
//            return obj
//        }
    }
})

