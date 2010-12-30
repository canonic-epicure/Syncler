Role('Syncler', {
    
    /*VERSION,*/
    
    use         : [
        'Syncler.Attribute.Object',
        'Syncler.Attribute.Array'
    ],
    
    requires    : [ 'newReplica' ],
    
    trait       : 'JooseX.CPS',
    
    
    has : {
    },
    
    
    
    continued : {
        
        methods : {
            
            setupReplica : function (config) {
                
                var replica     = config.replica || config.topic && config.topic.replica || this.newReplica()
                
                replica.setup(config).now()
            }
        }
    }
    
})


Syncler.I = {
    
    Object : function () {
        return new Syncler.Attribute.Object({ replica : this.replica })
    },
    
    
    Array : function () {
        return new Syncler.Attribute.Array({ replica : this.replica })
    }
}
