Role('Syncler', {
    
    /*VERSION,*/
    
    requires : [ 'newChannel', 'setupChannel', 'fetchTopic' ],
    
    
    has : {
        fayeClient              : { 
            is          : 'rw',
            required    : true
        }
    },
    
    
    does    : 'Syncler.PubSub.Faye'
})

