// client (browser)

var handle = new KiokuJS.Backend.CouchDB({
    
    trait       : Syncler.Client,
    
    baseURL     : '/db',
    fayeURL     : '/faye'
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
    
    fayeURL     : '/faye'
})


handle.setupChannel({ topicID : 'ABCD' }).andThen(function (channel) {
    
    var topic = channel.getTopic()

})
