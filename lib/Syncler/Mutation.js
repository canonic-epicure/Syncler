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
        
        apply : function (replica) {
            var object      = this.getObjectFrom(replica)
            var label       = this.label.replace(/^\//, '')
            
            if (this.checkPrecondition(replica)) {
                
                this.realize(replica)
                
                object.fireEvent('/mutation/apply/' + this.label, this)
                
                return
            }
            
            var mergeResult = this.mergeResult = this.merge(replica)
            
            object.fireEvent('/mutation/merge/' + this.label, mergeResult, this)
            
            mergeResult.apply(replica)
        },
        
        
        unapply : function (replica) {
            var object              = this.getObjectFrom(replica)
            var label               = this.label.replace(/^\//, '')
            var appliedMutation     = this.mergeResult || this
            
            appliedMutation.deRealize(replica)
            
            object.fireEvent('/mutation/unapply/' + this.label, appliedMutation)
            
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
        }
    }
})
