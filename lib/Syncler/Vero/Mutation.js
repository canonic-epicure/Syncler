Class('Syncler.Vero.Mutation', {
    
    has : {
        timestamp               : Joose.I.Date,
        
        state                   : 'transient',
        
        creator                 : null,
        
        node                    : {
            trait       : KiokuJS.Feature.Attribute.Skip,
            
            required    : true 
        }
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

