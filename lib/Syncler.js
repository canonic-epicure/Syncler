Role('Syncler', {
    
    /*VERSION,*/
    
    use         : [
        'Syncler.Attribute.Object',
        'Syncler.Attribute.Array'
    ],
    
    requires    : [ 'newReplica' ],
    
    trait       : 'JooseX.CPS',
    
    
    
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
    
    Object : function (strongConnection) {
        var config = { replica : this.replica }
        
        if (strongConnection) config.host = this
        
        return new Syncler.Attribute.Object(config)
    },
    
    
    Array : function (strongConnection) {
        var config = { replica : this.replica }
        
        if (strongConnection) config.host = this
        
        return new Syncler.Attribute.Array(config)
    }
}
