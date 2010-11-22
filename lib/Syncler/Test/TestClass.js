Class('Syncler.Test.TestClass', {
    
    trait   : 'Syncler.Object.Meta',
    
    does    : [
        'Syncler.Object.Role.Topic',
        'KiokuJS.Feature.Class.OwnUUID'
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
