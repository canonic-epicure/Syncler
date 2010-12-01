Role('Syncler.Object.Meta', {
    
    use : [ 
        'Syncler.Mutation.Class.Create',
        
        'Syncler.Object.Attribute'
    ],
    
    
    has : {
    },
    
    
    
    override : {
        
        initInstance : function (instance, config) {
            instance.__IS_BEING_CREATED__ = true
            
            var mutation = new Syncler.Mutation.Class.Create({
                config      : Joose.O.copy(config),
                className   : instance.meta.name
            })
            
            config.replica.addMutation(mutation)
            
            this.SUPERARG(arguments)
            
            delete instance.__IS_BEING_CREATED__
            
            mutation.objectUUID = config.replica.pinObject(instance)
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
            
            hasSynced : function (meta, info) {
                
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


