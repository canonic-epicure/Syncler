Role('Syncler.Node.Meta', {
    
    use : [ 
        'Syncler.Node.Role',
        'Syncler.Node',
        'Syncler.Node.Mutation.Create',
        
        'Syncler.Node.Attribute'
    ],
    
    
    has : {
    },
    
    
    methods : {
        
    },
    
    
    after : {
        
        processStem : function () {
            this.addRole(Syncler.Node.Role)
        }
    },
    
    
    
    
    override : {
        
        initInstance : function (instance, config) {
            
            var NODE = instance.NODE = new Syncler.Node({
                object      : instance,
                
                scope       : config.scope
            })
            
            var creation = new Vero.Mutation.Create({
                node    : NODE
            })
            
            NODE.addMutation(creation)
            
            this.SUPER(instance, config)
            
            
            NODE.acquireID()
            
            NODE.commit()
        }
    },
    
    
    builder : {
        
        methods : {
            
            sync : function (meta, info) {
                
                var attributes = {}
                
                Joose.O.eachOwn(info, function (props, name) {
                    if (typeof props != 'object' || props == null || props.constructor == / /.constructor) props = { init : props }
                    
                    // XXX add separate attribute class
                    props.trait = Syncler.Node.Attribute
                    
                    attributes[ name ] = props
                })
                
                this.has(meta, attributes)
            }
        }
    }
})

