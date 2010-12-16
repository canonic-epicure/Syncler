Class('Syncler.Test.TestClass', {
    
    does    : [
        'Syncler.Topic'
    ],
    
    use     : [
        'Data.UUID',
        'Syncler'
    ],
    
    
    has : {
        uuid        : function () { return 'TestClass-' + Data.UUID.uuid() },
        
        attr1       : null,
        attr2       : null,
        attr3       : null,
        attr4       : null,
        attr5       : null,
        
        obj1        : Joose.I.Defer('Syncler.I.Object'),
        obj2        : Joose.I.Defer('Syncler.I.Object'),
        obj3        : Joose.I.Defer('Syncler.I.Object'),
        obj4        : Joose.I.Defer('Syncler.I.Object'),
        obj5        : Joose.I.Defer('Syncler.I.Object'),
        
        arr1        : Joose.I.Defer('Syncler.I.Array'),
        arr2        : Joose.I.Defer('Syncler.I.Array'),
        arr3        : Joose.I.Defer('Syncler.I.Array'),
        arr4        : Joose.I.Defer('Syncler.I.Array'),
        arr5        : Joose.I.Defer('Syncler.I.Array')
    },
    
    
    methods : {
        
        getTopicID : function () {
            return this.uuid
        }
    } 
})