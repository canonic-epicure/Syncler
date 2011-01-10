Role('Syncler', {
    
    /*VERSION,*/
    
    use         : [
        'Syncler.Composite.Object',
        'Syncler.Composite.Array'
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
    },
    
    
body : function () {

    
    var getInitializerFor = function (ctor) {
        
        return function (strongConnection, name) {
            
            // has : { attr : Syncler.I.Object(true) } variant
            if (this == Syncler.I) return function (init, name) {
                var config = {
                    replica : this.replica,
                    name    : name
                }
                
                if (strongConnection) config.host = this
                
                return new ctor(config)
            }

            // has : { attr : Syncler.I.Object } variant
            
            var config = {
                replica : this.replica,
                name    : name
            }
            
            return new ctor(config)
        }
    }
    
    
    Syncler.I = {
        Object  : getInitializerFor(Syncler.Composite.Object),
        Array   : getInitializerFor(Syncler.Composite.Array)
    }
    
}})
