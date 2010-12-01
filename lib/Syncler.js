Role('Syncler', {
    
    /*VERSION,*/
    
    requires    : [ 'newReplica' ],
    
    trait       : 'JooseX.CPS',
    
    
    has : {
//        fayeClient              : { 
//            is          : 'rw',
//            required    : true
//        }
    },
    
    
//    does    : 'Syncler.Transport.SockectIO',
    
    
    continued : {
        
        methods : {
            
//            setupReplica : function (config) {
//                
//                var replica     = config.replica || config.topic && config.topic.replica || this.newReplica()
//                
//                replica.setup(config || {}).now()
//            }
        }
    }
    
})


Syncler.I = {
    
    Object : function () {
        return new Syncler.Attribute.Object(this)
    },
    
    
    Array : function () {
        return new Syncler.Attribute.Array(this)
    }
} 