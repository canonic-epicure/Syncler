// client (browser)

var handle = new KiokuJS.Backend.CouchDB({
    
    traits      : [ Syncler.Client, KiokuJS.Backend.Batch ],
    
    baseURL     : '/db',
    fayeClient  : new Faye.Client('/faye')
})


handle.setupChannel({ topicID : 'ABCD' }).andThen(function (channel) {
    
    var topic = channel.getTopic()

})




var topic = new Topic({ channel : handle.newChannel() })


handle.setupChannel({ topic : topic }).andThen(function (channel) {
    
    var topic = channel.getTopic()

})




// server (node)


var handle = new KiokuJS.Backend.CouchDB({
    
    trait       : Syncler.Server,
    
    dbURL       : '/5984/somebase',
    
    fayeClient  : bayex.getClient()
})


handle.setupChannel({ topicID : 'ABCD' }).andThen(function (channel) {
    
    var topic = channel.getTopic()

})
