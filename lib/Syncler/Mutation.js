Role('Syncler.Mutation', {
    
    requires : [ 'apply', 'unapply', 'savePrecondition', 'checkPrecondition', 'merge' ],
    
    
    does     : 'KiokuJS.Aspect.BeforeCollapse',
    
    
    has : {
        clientID        : null,
        acceptNum       : null,
        
        mergeResultOf   : null,
        
        consistency     : 'firstwin',
        status          : 'tentative',
        
        // mutation always receives a object
        object          : {
            required    : true,
            trait       : 'KiokuJS.Feature.Attribute.Skip'
        },
        
        // but it will exchange the actual instance to its ID as soon as possible (with `detachFromObject`)
        // this breaks the deadlock, when the object can receive the ID only after all attributes gets initialized
        // but during initialization, attributes may create new mutations, targeting the same object
        objectID        : null
    },
    
    
    before : {
        
        // as the last resort make sure we've detached from the object before the mutation gets serialized
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
