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
            
            var VERO = instance.VERO = new Syncler.Vero({
                object      : instance,
                
                channel     : config.channel
            })
            
            var creation = new Syncler.Vero.Mutation.Create({
                object    : instance
            })
            
            VERO.addMutation(creation)
            
            this.SUPER(instance, config)
            
            VERO.commit()
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

