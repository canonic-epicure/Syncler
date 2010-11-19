// client - A - source

var handle = new KiokuJS.Backend.CouchDB({
    
    traits      : [ Syncler.Client, KiokuJS.Backend.Batch ],
    
    baseURL     : '/db',
    fayeClient  : new Faye.Client('/faye')
})


// new topic

var topic = new Topic({ replica : handle.newReplica() })


handle.setupReplica({ topic : topic }).andThen(function (replica) {
    
    var topic = replica.getTopic()

    topic.setAttr('yo')
})




// client - B - receiver


// existing topic

handle.setupReplica({ topicID : 'ABCD' }).andThen(function (replica) {
    
    var topic = replica.getTopic()
    
    replica.on('mutate', function () {
    
    })

})





// server


var handle = new KiokuJS.Backend.CouchDB({
    
    trait       : Syncler.Server,
    
    dbURL       : '/5984/somebase',
    
    fayeClient  : bayex.getClient()
})


handle.setupReplica({ topicID : 'ABCD' }).andThen(function (replica) {
    
    var topic = replica.getTopic()

})
