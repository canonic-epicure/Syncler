Role('Syncler.Mutation', {
    
    requires : [ 'apply', 'unapply', 'savePrecondition', 'checkPrecondition', 'merge' ],
    
    
    does     : 'KiokuJS.Aspect.BeforeCollapse',
    
    
    has : {
        clientID        : null,
        acceptNum       : null,
        
        mergeResultOf   : null,
        
        consistency     : 'firstwin',
        status          : 'tentative',
        
        object          : {
            required    : true,
            trait       : 'KiokuJS.Feature.Attribute.Skip'
        },
        objectID        : null
    },
    
    
    override : {
        
        beforeCollapse : function () {
            if (!this.objectID) this.detachFromObject()
        }
    },
    
    
    methods : {
        
        detachFromObject : function (replica) {
            if (this.objectID) return
            
            var object = this.object
            
            if (!object) throw "No object in mutation - can't detach"
            
            this.objectID   = replica.objectToId(object)
            
            delete this.object
        },
        
        
        getObjectFrom : function (replica) {
            if (this.objectID) return replica.idToObject(this.objectID)
            
            var object = this.object
            
            if (object) {
                this.detachFromObject(replica)
                
                return object
            }
            
            throw "No object in mutation"
        },
        
        
        commutativeWith : function (mutation) {
            return false
        }
    }
})
