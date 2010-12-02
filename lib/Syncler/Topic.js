Role('Syncler.Topic', {
    
    requires    : [ 'getTopicID' ],
    
    does        : [
        'KiokuJS.Feature.Class.OwnID',
        'Syncler.Object'
    ],
    
    
    methods : {
        
        acquireID : function () {
            
            return this.getTopicID()
        }
    }
})

