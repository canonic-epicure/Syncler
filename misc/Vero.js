Role('Syncler.Vero', {
    
    use : [ 
        'Syncler.Vero.Role',
        'Syncler.Node',
        'Syncler.Vero.Mutation.Create'
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
            
            var VERO = instance.VERO = new Vero.Object({
                object      : instance,
                
                channel     : config.channel
            })
            
            var creation = new Vero.Mutation.Create({
                className   : instance.meta.name,
                
                objectUUID  : VERO.UUID // XXX instance.acquireID()
            })
            
            VERO.addMutation(creation)
            
            this.SUPER(instance, config)
            
            VERO.commit()
        }
    }
})

