Role('Syncler.Mutation', {
    
    requires : [ 'realize', 'deRealize', 'savePrecondition', 'checkPrecondition', 'merge' ],
    
    does        : [
        'KiokuJS.Feature.Class.OwnUUID',
        'Syncler.Observable'
    ],
    
    
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
                
                this.fireEvent('apply', this)
                
                return
            }
            
            var mergeResult = this.mergeResult = this.merge(replica)
            
            mergeResult.apply(replica)
        },
        
        
        unapply : function (replica) {
            (this.mergeResult || this).deRealize(replica)
            
            delete this.mergeResult
            
            this.fireEvent('unapply', this)
        },
        
        
        getObjectFrom : function (replica) {
            return replica.idToObject(this.objectID)
        },
        
        
        commutativeWith : function (mutation) {
            return false
        }
    }
})
