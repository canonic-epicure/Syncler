Module('Syncler.Topic', {

    use     : [
        'Syncler',
        'Syncler.Object',
        'Syncler.Topic.Flash',
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
            ownFlash        : {
                trait       : KiokuJS.Feature.Attribute.Skip,
                builder     : 'this.buildOwnFlash'
            },
            FLASH           : function () { return new Syncler.Topic.Flash({ replica : this }) }
        },
        
        
        methods : {
            
            buildOwnFlash : function () {
                return new Syncler.Attribute.Object({ replica : this.replica })
            },
            
            
            acquireID : function () {
                return this.getTopicID()
            }
        }
    })
}})
