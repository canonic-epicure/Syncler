Class('Syncler.Test.Actor', {
    
    trait       : 'JooseX.CPS',
    
    
    has : {
        sampleHandle        : { required : true },
        name                : { required : true },
        
        handle              : null,
        channel             : null,
        
        topic               : null,
        topicID             : { required : true }
    },
    
    
    methods : {
        
        mutate : function () {
            var topic       = this.topic
            var attributes  = []
            
            topic.meta.forEachSyncedAttribute(function (attribute, name) {
                
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
                var attribute = attributes.shift().attribute
                
                attribute.setValueTo(topic, Math.floor(Math.random() * 1e8))
            }
            
            this.channel.commit()
        }
    },
    
    
    continued : {
        
        methods : {
            
            setup : function () {
                var sampleHandle    = this.sampleHandle
                
                var handle          = this.handle = new KiokuJS.Backend.CouchDB({
                    trait   : [ Syncler.Client, KiokuJS.Backend.Batch ],
                    
                    baseURL     : 'http://local/' + sampleHandle.__port__,
                    dbURL       : sampleHandle.dbURL,
                    
                    fayeClient  : sampleHandle.fayeClient
                })
                
                handle.setupChannel({ topicID : this.topicID }).andThen(function (channel) {
                    
                    this.channel    = channel
                    this.topic      = channel.getTopic()
                    
                    this.CONTINUE()
                    
                }, this)
            },
            
            
            delay : function (min, max) {
                setTimeout(this.getCONTINUE(), Math.floor(Math.random() * (max - min)) + min)
            }
        }
    }
})
