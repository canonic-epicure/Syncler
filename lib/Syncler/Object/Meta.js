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
        
        // XXX include effects of `initialize` to the create mutation (scan instance after `initialize`)?
        initInstance : function (instance, config) {
            
            var replica = instance.replica = config.replica
            
            instance.__IS_BEING_CREATED__ = true
            
            this.SUPER(instance, config)
            
            delete instance.__IS_BEING_CREATED__
            
            // should pin object only after all attributes gets initialized, so it can compute its own ID (if chose so)

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
    },
    
    
    body : function () {
        
        Class('.Syncler.Object.Meta.Attribute', {
            
            isa     : Joose.Managed.Attribute,
            does    : Syncler.Object.Attribute
        })
    }
})


