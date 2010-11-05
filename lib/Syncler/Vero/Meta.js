Role('Syncler.Vero.Meta', {
    
    use : [ 
        'Syncler.Vero.Role',
        'Syncler.Vero',
        'Syncler.Vero.Mutation.Create',
        
        'Syncler.Vero.Attribute'
    ],
    
    
    has : {
    },
    
    
    methods : {
        
    },
    
    
    after : {
        
        processStem : function () {
            this.addRole(Syncler.Vero.Role)
        }
    },
    
    
    
    
    override : {
        
        initInstance : function (instance, config) {
            
            var channel = config.channel
            
            instance.VERO = new Syncler.Vero({
                object      : instance,
                
                channel     : channel
            })
            
            channel.addMutation(new Syncler.Vero.Mutation.Create({
                object    : instance
            }))
            
            this.SUPER(instance, config)
        }
    },
    
    
    methods : {
        
        forEachSyncedAttribute : function (func, scope) {
            
            this.getAttributes().each(function (attribute, name) {
                
                if (attribute.meta.does && attribute.meta.does(Syncler.Vero.Attribute))
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
                    
                    // XXX add separate attribute class
                    props.trait = Syncler.Vero.Attribute
                    
                    attributes[ name ] = props
                })
                
                this.has(meta, attributes)
            }
        }
    }
})

