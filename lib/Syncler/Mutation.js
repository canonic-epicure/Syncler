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
        
        persistent      : true,
        
        objectID        : {
            required    : true
        }
    },
    
    
    methods : {
        
        apply : function (replica, preconditionsOk, alreadyRealized, realizeWith) {
            var label               = this.label
            var realizedInCheck     = { value : false }
            
            if (preconditionsOk || this.checkPrecondition(replica, realizedInCheck)) {
                
                if (!alreadyRealized && !realizedInCheck.value) this.realize(replica, realizeWith)
                
                // should `getObjectFrom` only here, after `realize` since for `create` mutations there will be no object yet
                var object  = this.getObjectFrom(replica)
                
                if (object) object.fireEvent('/mutation/apply/' + label, this)
                
                return true
            }
            
            if (this.insteadOf) throw "Merge result can't conflict"
            
            var mergeResult     = this.mergeResult = this.merge(replica)
            var object          = this.getObjectFrom(replica)
            
            // some mutations may not have `object` ie - Void
            if (object) object.fireEvent('/mutation/merge/' + label, mergeResult, this)
            
            mergeResult.apply(replica)
            
            return false
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
        
        
        // XXX delete mutations should also fire the event from the object 
        onCommit : function (replica) {
            var object              = this.getObjectFrom(replica)
            
            if (object) object.fireEvent('/mutation/commit/' + this.label, this.mergeResult || this)
        },
        
        
        getPersistentObjects : function (replica, persistLog) {
            var object              = this.getObjectFrom(replica)
            
            return persistLog ? [ this, object ] : [ object ]
        }
    }
})
