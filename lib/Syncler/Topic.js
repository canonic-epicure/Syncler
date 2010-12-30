Module('Syncler.Topic', {

    use     : [
        'Syncler',
        'Syncler.Object',
        'KiokuJS.Feature.Attribute.Skip',
        'KiokuJS.Feature.Class.OwnID'
    ],
    
    
body : function () {

    Role('.Syncler.Topic', {
        
        requires    : [ 'getTopicID' ],
        
        does        : [
            KiokuJS.Feature.Class.OwnID,
            Syncler.Object
        ],
        
        
        has : {
//            ownFlash        : {
//                trait       : KiokuJS.Feature.Attribute.Skip,
//                builder     : 'this.buildOwnFlash'
//            },
//            FLASH           : Syncler.I.Object
        },
        
        
        methods : {
            
//            buildOwnFlash : function () {
//                return new Syncler.Attribute.Object(this.replica)
//            },
            
            
            acquireID : function () {
                return this.getTopicID()
            }
        }
    })
}})
