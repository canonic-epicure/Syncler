Module('Syncler.Test.TestClass', {
    
    use     : [
        'Syncler.Topic',
        'Data.UUID',
        'Syncler'
    ],
    
    
body : function () {

    
    Class('.Syncler.Test.TestClass', {
        
        does    : [
            Syncler.Topic
        ],
        
        has : {
            uuid        : function () { return 'TestClass-' + Data.UUID.uuid() },
            
            attr1       : null,
            attr2       : null,
            attr3       : null,
            
            obj1        : Syncler.I.Object,
            obj2        : Syncler.I.Object,
            obj3        : Syncler.I.Object,
            
            arr1        : Syncler.I.Array,
            arr2        : Syncler.I.Array,
            arr3        : Syncler.I.Array
        },
        
        
        methods : {
            
            getTopicID : function () {
                return this.uuid
            }
        } 
    })    
    

}})