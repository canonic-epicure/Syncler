Role('Syncler.Topic.UUID', {
    
    use    : 'Data.UUID',
    
    does        : [
        'Syncler.Topic'
    ],
    
    
    hasSynced : {
        topicID : {
            init    : function () { return Data.UUID.uuid() }
        }
    }
})

