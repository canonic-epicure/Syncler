Role('Syncler', {
    
    /*VERSION,*/
    
    requires : [ 'newChannel', 'setupChannel' ],
    
    
    has : {
        fayeClient              : { 
            is          : 'rw',
            required    : true
        }
    },
    
    
    does    : 'Syncler.PubSub.Faye'
})

