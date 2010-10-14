Class('Syncler.Test.TestClass', {
    
    trait   : 'Syncler.Vero.Meta',
    
    does    : [
        'Syncler.Vero.Role.Topic',
        'KiokuJS.Feature.Class.OwnUUID'
    ],
    
    sync : {
        attr1 : {
            init    : 'attr1'
            
        },
        
        attr2 : {
        },
        
        
        attr3 : {
        }
    },
    
    
    methods : {
        
        getTopicID : function () {
            return this.uuid
        }
    } 
    
})
