Role('Syncler.Mutation', {
    
    requires : [ 'realize', 'deRealize', 'savePrecondition', 'checkPrecondition', 'merge' ],
    
    
    has : {
        clientID        : null,
        acceptNum       : null,
        commitNum       : null,
        
        mergeResult     : null,
        
        consistency     : 'firstwin',
        status          : 'tentative',
        
        objectID        : {
            required    : true
        }
    },
    
    
    methods : {
        
        apply : function (replica) {
            if (this.checkPrecondition(replica)) {
                
                this.realize(replica)
                
                return this
            }
            
            var mergeResult = this.mergeResult = this.merge(replica)
            
            mergeResult.apply(replica)
        },
        
        
        unapply : function () {
            (this.mergeResult || this).deRealize(replica)
            
            delete this.mergeResult
        },
        
        
        getObjectFrom : function (replica) {
            return replica.idToObject(this.objectID)
        },
        
        
        commutativeWith : function (mutation) {
            return false
        }
    }
})
