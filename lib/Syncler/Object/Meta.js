Role('Syncler.Object.Meta', {
    
    use : [ 
        'Syncler.Object.Mutation.Create',
        
        'Syncler.Object.Attribute'
    ],
    
    
    has : {
    },
    
    
    
    before : {
        
        initInstance : function (instance, config) {
            
            config.replica.addMutation(new Syncler.Object.Mutation.Create({
                object      : instance,
                
                config      : Joose.O.copy(config)
            }))
        }
    },
    
    
    methods : {
        
        forEachSyncedAttribute : function (func, scope) {
            
            this.getAttributes().each(function (attribute, name) {
                
                if (attribute.meta.does && attribute.meta.does(Syncler.Object.Attribute))
                    if (func.call(scope, attribute, name) === false) return false
            })
        }
    },
    
    
    builder : {
        
        methods : {
            
            sync : function (meta, info) {
                
                var attributes = {}
                
                Joose.O.eachOwn(info, function (props, name) {
                    if (typeof props != 'object' || props == null || props.constructor == / /.constructor) props = { init : props }

                    if (!props.meta)
                        props.meta = Syncler.Object.Meta.Attribute
                    else {
                        props.traits = [ Syncler.Object.Attribute ].concat(props.trait || [], props.traits || [])
                        
                        delete props.trait
                    }
                    
                    attributes[ name ] = props
                })
                
                this.has(meta, attributes)
            }
        }
    },
    
    
    body : function () {
        
        Class('.Syncler.Object.Meta.Attribute', {
            isa     : Joose.Managed.Attribute,
            does    : Syncler.Object.Attribute
        })
    }
})


