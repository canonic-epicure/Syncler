Role('Syncler.Object.Meta', {
    
    use : [ 
        'Syncler.Mutation.Class.Create',
        
        'Syncler.Object.Attribute',
        
        'KiokuJS.Feature.Attribute.Skip'
    ],
    
    
    has : {
        defaultAttributeClass       : Joose.I.FutureClass('Syncler.Object.Meta.Attribute')
    },
    
    
    override : {
        
        initInstance : function (instance, config) {
            
            var replica = instance.replica = config.replica
            
            instance.__IS_BEING_CREATED__ = true
            
            this.SUPER(instance, config)
            
            delete instance.__IS_BEING_CREATED__
            
            // should pin object only after all attributes gets initialized, so it can compute its own ID (if choose so)

            var attrValues = {}
            
            this.forEachStoredAttribute(function (attribute, name) {
                
                attrValues[ name ] = attribute.getRawValueFrom(instance)
            })
            
            var mutation = new Syncler.Mutation.Class.Create({
                className   : instance.meta.name,
                
                objectID    : replica.pinObject(instance),
                
                attrValues  : attrValues
            })
            
            replica.acceptMutation(mutation)
        }
    },
    
    
    methods : {
        
        forEachStoredAttribute : function (func, scope) {
            
            this.getAttributes().each(function (attribute, name) {
                
                if (attribute.meta.does && attribute.meta.does(KiokuJS.Feature.Attribute.Skip)) return
                
                if (func.call(scope, attribute, name) === false) return false
            })
        }
        
        
//        forEachSyncedAttribute : function (func, scope) {
//            
//            this.getAttributes().each(function (attribute, name) {
//                
//                if (attribute.meta.does && attribute.meta.does(Syncler.Object.Attribute))
//                    if (func.call(scope, attribute, name) === false) return false
//            })
//        }
    },
    
//    ,
//    
//    
//    builder : {
//        
//        methods : {
//            
//            hasSync : function () {
//                this.hasSynced.apply(this, arguments)
//            },
//            
//            
//            hasSynced : function (meta, info) {
//                
//                var attributes = {}
//                
//                Joose.O.eachOwn(info, function (props, name) {
//                    if (typeof props != 'object' || props == null || props.constructor == / /.constructor) props = { init : props }
//
//                    if (!props.meta)
//                        props.meta = Syncler.Object.Meta.Attribute
//                    else {
//                        props.traits = [ Syncler.Object.Attribute ].concat(props.trait || [], props.traits || [])
//                        
//                        delete props.trait
//                    }
//                    
//                    attributes[ name ] = props
//                })
//                
//                this.has(meta, attributes)
//            }
//        }
//    },
    
    
    body : function () {
        
        Class('.Syncler.Object.Meta.Attribute', {
            
            isa     : Joose.Managed.Attribute,
            does    : Syncler.Object.Attribute
        })
    }
})


