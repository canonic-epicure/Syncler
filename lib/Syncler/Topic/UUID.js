Role('Syncler.Topic.UUID', {
    
    use    : 'Data.UUID',
    
    does        : [
        'Syncler.Topic'
    ],
    
    
    has : {
        topicID : {
            init    : function () { return Data.UUID.uuid() }
        }
    }
})

