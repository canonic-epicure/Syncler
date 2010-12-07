Class('Syncler.Test.TestClass', {
    
    does    : [
        'Syncler.Topic'
    ],
    
    
    has : {
        uuid    : function () { return 'TestClass-' + Data.UUID.uuid() }
    },
    
    
    sync : {
        attr1 : {
            init    : 'attr1'
        },
        
        attr2 : null,
        attr3 : null,
        
        attr4 : null,
        attr5 : null,
        attr6 : null,
        attr7 : null,
        attr8 : null,
        attr9 : null,
        
        attr10      : null
    },
    
    
    methods : {
        
        getTopicID : function () {
            return this.uuid
        }
    } 
    
})
