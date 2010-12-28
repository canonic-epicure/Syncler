Role('Syncler.Topic.UUID', {
    
    use    : 'Data.UUID',
    
    does        : [
        'Syncler.Topic'
    ],
    
    
    has : {
        topicID : {
            is      : 'rw',
            init    : function () { return Data.UUID.uuid() }
        }
    }
})

