Role('Syncler.Mutation', {
    
    requires : [ 'realize', 'deRealize', 'savePrecondition', 'checkPrecondition', 'merge' ],
    
    
    has : {
        clientID        : null,
        acceptNum       : null,
        commitNum       : null,
        
        mergeResultOf   : null,
        
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
            
            var mergedMutation = this.merge(replica)
            
            mergedMutation.mergeResultOf = this
            
            return mergedMutation.apply(replica)
        },
        
        
        unapply : function () {
            this.deRealize(replica)
            
            return this.getSourceMutation()
        },
        
        
        getSourceMutation : function () {
            if (this.mergeResultOf) return this.mergeResultOf.getSourceMutation()
            
            return this
        },
        
        
        getObjectFrom : function (replica) {
            return replica.idToObject(this.objectID)
        },
        
        
        commutativeWith : function (mutation) {
            return false
        }
    }
})
