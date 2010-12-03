Role('Syncler.Object.Meta', {
    
    use : [ 
        'Syncler.Mutation.Class.Create',
        
        'Syncler.Object.Attribute'
    ],
    
    
    has : {
    },
    
    
    override : {
        
        initInstance : function (instance, config) {
            
            var replica = instance.replica = config.replica
            
            var mutation = new Syncler.Mutation.Class.Create({
                className   : instance.meta.name,
                objectID    : replica.pinObject(instance)
            })
            
            replica.addMutation(mutation)
            
            this.SUPER(instance, config)
            
//            // can pin object only here - after all attributes gets initialized, so it can compute its own ID (if choose so)
//            mutation.objectID = replica.pinObject(instance)
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
            
            hasSync : function () {
                this.hasSynced.apply(this, arguments)
            },
            
            
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


