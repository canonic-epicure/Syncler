Role('Syncler.Topic.UUID', {
    
    use    : 'Data.UUID',
    
    does        : [
        'Syncler.Topic'
    ],
    
    
    has : {
        topicID : {
            is      : 'ro',
            
            init    : function () { return Data.UUID.uuid() }
        }
    }
})

