Class('Syncler.Test.Actor', {
    
    trait       : 'JooseX.CPS',
    
    
    has : {
        sampleHandle        : { required : true },
        name                : { required : true },
        
        handle              : null,
        replica             : null,
        
        topic               : null,
        topicID             : { required : true }
    },
    
    
    methods : {
        getRandomArrayValue : function (arr) {
            return arr[ Math.floor(arr.length * Math.random()) ]
        },
        
        
        getRandomValue : function (replica, instance) {
            var type        = this.getRandomArrayValue([ 'object', 'array', 'number', 'string' ])
            
            if (type == 'object')       return new Syncler.Attribute.Object({
                replica     : replica,
                value       : { key : Math.floor(Math.random() * 1e8) }
            })
            
            if (type == 'array')        return new Syncler.Attribute.Array({
                replica     : replica,
                value       : [ Math.floor(Math.random() * 1e8) ]
            })
            
            if (type == 'number')       return Math.floor(Math.random() * 1e8)
            if (type == 'string')       return Math.floor(Math.random() * 1e8) + ''
        },
        
        
        getRandomArrayMutation : function (replica, instance, synclerArray) {
            var mutation    = this.getRandomArrayValue([ 'push', 'pop', 'shift', 'unshift', 'set' ])
            
            var arrLength   = synclerArray.length()
            
            if (arrLength) {
                if (mutation == 'set') synclerArray.set(Math.floor(arrLength * Math.random()), this.getRandomValue(replica, instance))
                
                if (mutation == 'shift') synclerArray.shift()
                if (mutation == 'pop') synclerArray.shift()
                
                if (mutation == 'push') synclerArray.push(this.getRandomValue(replica, instance))
                if (mutation == 'unshift') synclerArray.unshift(this.getRandomValue(replica, instance))
                
            } else {
                if (mutation == 'push') synclerArray.push(this.getRandomValue(replica, instance))
                if (mutation == 'unshift') synclerArray.unshift(this.getRandomValue(replica, instance))
            }
        },
        
        
        getRandomObjectMutation : function (replica, instance, synclerObject) {
            var mutation    = this.getRandomArrayValue([ 'set', 'remove' ])
            
            var objCount    = synclerObject.count()
            var objKeys     = synclerObject.keys()
            
            if (objCount) {
                if (mutation == 'set') synclerObject.set(this.getRandomArrayValue(objKeys), this.getRandomValue(replica, instance))
                
                if (mutation == 'remove') synclerObject.remove(this.getRandomArrayValue(objKeys))
            } else {
                if (mutation == 'set') synclerObject.set(this.getRandomArrayValue([ 'key', 'key1', 'key2', 'key3' ]), this.getRandomValue(replica, instance))
            }
        },
        
        
        logTopicMutations : function () {
            console.log('Mutations of ' + this.name)
            
            Joose.A.each(this.topic.replica.committedQueue, function (mutation) {
                console.log('uuid: ' + mutation.uuid + ' hasMerge: ' + (mutation.mergeResult != null) )
            })
        },
        
        
        unapplyAll : function () {
            var replica         = this.topic.replica
            var mutations       = replica.committedQueue
            
            for (var i = mutations.length - 1; i >= 0; i--)
                mutations[ i ].unapply(replica)
        },
        
        
        applyAll : function () {
            var replica = this.topic.replica
            
            Joose.A.each(replica.committedQueue, function (mutation) {
                mutation.apply(replica)
            })
        }
    },
    
    
    continued : {
        
        methods : {
            
            mutate : function () {
                var topic       = this.topic
                var attributes  = []
                
                topic.meta.forEachStoredAttribute(function (attribute, name) {
                    
                    if (name == 'replica') return
                    
                    attributes.push({
                        attribute       : attribute,
                        random          : Math.random()
                    })
                })
                
                attributes.sort(function (a, b) {
                    return b.random - a.random
                })
                
                var howMany = 2 + Math.floor(Math.random() * 3)
                
                for (var i = 1; i <= howMany; i++) {
                    var attribute   = attributes.shift().attribute
                    var attrName    = attribute.name
                    
                    var value       = topic[ attrName ]
                    
                    if (/^arr/.test(attrName))  this.getRandomArrayMutation(topic.replica, topic, value)
                    if (/^obj/.test(attrName))  this.getRandomObjectMutation(topic.replica, topic, value)
                    if (/^attr/.test(attrName)) attribute.setValueTo(topic, this.getRandomValue(topic.replica, topic))
                }
                
                this.CONTINUE()
            },
            
        
            setup : function () {
                var sampleHandle    = this.sampleHandle
                
                var handle          = this.handle = new KiokuJS.Backend.CouchDB({
                    trait   : [ Syncler.Client, KiokuJS.Backend.Batch ],
                    
                    baseURL     : 'http://local/' + sampleHandle.__port__,
                    dbURL       : sampleHandle.dbURL,
                    
                    port        : sampleHandle.__port__
                })
                
                handle.setupReplica({ topicID : this.topicID }).andThen(function (replica) {
                    
                    this.replica    = replica
                    this.topic      = replica.getTopic()
                    
                    this.CONTINUE()
                    
                }, this)
            },
            
            
            delay : function (min, max) {
                setTimeout(this.getCONTINUE(), Math.floor(Math.random() * (max - min)) + min)
            }
        }
    }
})
