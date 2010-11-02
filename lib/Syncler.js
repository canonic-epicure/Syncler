Role('Syncler', {
    
    /*VERSION,*/
    
    requires    : [ 'newChannel' ],
    
    trait       : 'JooseX.CPS',
    
    
    has : {
        fayeClient              : { 
            is          : 'rw',
            required    : true
        }
    },
    
    
    does    : 'Syncler.PubSub.Faye',
    
    
    continued : {
        
        methods : {
            
            setupChannel : function (config) {
                
                var channel     = config.channel || config.topic && config.topic.channel || this.newChannel()
                
                channel.setup(config || {}).now()
            }
        }
    }
    
})

