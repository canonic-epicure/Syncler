// client - A - source

var handle = new KiokuJS.Backend.CouchDB({
    
    traits      : [ Syncler.Client, KiokuJS.Backend.Batch ],
    
    dbURL       : '/5984/db',
    baseURL     : '/8080'
})


// new topic

var replica     = handle.newReplica()

var topic = new Topic({ replica : replica })

replica.setup(topic).andThen(function (replica) {
    
    var topic = replica.getTopic()

    topic.setAttr('yo')
})




// client - B - receiver


// existing topic

handle.newReplica().setup('ABC-123').andThen(function (replica) {
    
    var topic = replica.getTopic()
    
    replica.on('mutate', function () {
    
    })

})





// server


var handle = new KiokuJS.Backend.CouchDB({
    
    trait       : Syncler.Server,
    
    parallelMax : 10,
    
    dbURL       : '/5984/somebase'
})


handle.setupReplica({ topicID : 'ABCD' }).andThen(function (replica) {
    
    var topic = replica.getTopic()

})




line.write({
    type        : 'Syncler.Mutation.Attribute',
    
    name        : 'x1',
    value       : 10,
    
    consisteny  : 'firstwin'
})

line.setX1(10)


line.write({
    type        : 'Syncler.Mutation.Attribute.Several',
    
    consisteny  : 'firstwin',
    
    attributes  : [
        {
            object      : line,
            name        : 'x1',
            value       : 10
        },
        {
            object      : line,
            name        : 'y1',
            value       : 10
        }
    ]
})

line.setX1(10)



line.replica.write(Syncler.Operation.Auto(function () {
    
    line.setX1(x1)
    line.setY1(y1)
})





line.setY1(y1, 'lastwin')

line.commit()