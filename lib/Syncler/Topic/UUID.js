Role('Syncler.Topic.UUID', {
    
    does        : [
        'Syncler.Topic',
        'KiokuJS.Feature.Class.OwnUUID'
    ],
    
    
    methods : {
        
        // XXX handle `exclude` in `does` with JXND
        acquireID : function () {
            return this.getTopicID()
        },
        
        
        getTopicID : function () {
            return this.uuid
        }
    }
})

