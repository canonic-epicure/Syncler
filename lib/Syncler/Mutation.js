Role('Syncler.Mutation', {
    
    requires : [ 'apply', 'unapply', 'checkPrecondition', 'merge' ],
    
    has : {
        clientID        : null,
        acceptNum       : null,
        
        mergeResultOf   : null,
        
        consistency     : 'firstwin',
        
        object          : {
            trait       : 'KiokuJS.Feature.Attribute.Skip',
            required    : true 
        },
        objectUUID      : null
    },
    
    
    methods : {
        
//        commit : function (replica) {
//            this.objectUUID = replica.pinObject(this.object)
//        },
        
        
        getObjectFrom : function (replica) {
            return replica.idToObject(this.objectUUID)
        }
    }
})
