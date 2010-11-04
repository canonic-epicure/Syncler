Class('Syncler.Test.TestClass', {
    
    trait   : 'Syncler.Vero.Meta',
    
    does    : [
        'Syncler.Vero.Role.Topic',
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
        attr3 : null
    },
    
    
    methods : {
        
        getTopicID : function () {
            return this.uuid
        }
    } 
    
})
