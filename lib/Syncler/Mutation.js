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
        insteadOf       : null,
        
        label           : function () { return this.meta.name },
        
//        consistency     : 'firstwin',
//        status          : 'tentative',
        
        objectID        : {
            required    : true
        }
    },
    
    
    methods : {
        
        apply : function (replica, preconditionsOk, alreadyRealized, realizeWith) {
            var label       = this.label
            
            if (preconditionsOk || this.checkPrecondition(replica)) {
                
                if (!alreadyRealized) this.realize(replica, realizeWith)
                
                // should `getObjectFrom` only here, after `realize` since for `create` mutations there will be no object yet earlier
                var object  = this.getObjectFrom(replica)
                
                if (object) object.fireEvent('/mutation/apply/' + label, this)
                
                return
            }
            
            var mergeResult     = this.mergeResult = this.merge(replica)
            var object          = this.getObjectFrom(replica)
            
            // some mutations may not have `object` ie - Void
            if (object) object.fireEvent('/mutation/merge/' + label, mergeResult, this)
            
            mergeResult.apply(replica)
        },
        
        
        unapply : function (replica) {
            var object              = this.getObjectFrom(replica)
            var appliedMutation     = this.mergeResult || this
            
            appliedMutation.deRealize(replica)
            
            if (object) object.fireEvent('/mutation/unapply/' + this.label, appliedMutation)
            
            delete this.mergeResult
        },
        
        
        getObjectFrom : function (replica) {
            return replica.idToObject(this.objectID)
        },
        
        
        commutativeWith : function (mutation) {
            return false
        },
        
        
        hasLiveInstanceOf : function (replica, classCtor) {
            return this.getObjectFrom(replica) instanceof classCtor
        },
        
        
        onCommit : function (replica) {
            var object              = this.getObjectFrom(replica)
            
            if (object) object.fireEvent('/mutation/commit/' + this.label, this.mergeResult || this)
        }
    }
})
