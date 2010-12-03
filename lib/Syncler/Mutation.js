Role('Syncler.Mutation', {
    
    requires : [ 'apply', 'unapply', 'savePrecondition', 'checkPrecondition', 'merge' ],
    
    
    has : {
        clientID        : null,
        acceptNum       : null,
        
        mergeResultOf   : null,
        
        consistency     : 'firstwin',
        status          : 'tentative',
        
        objectID        : {
            required    : true
        }
    },
    
    
    methods : {
        
        getObjectFrom : function (replica) {
            return replica.idToObject(this.objectID)
        },
        
        
        commutativeWith : function (mutation) {
            return false
        }
    }
})
