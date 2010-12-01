Role('Syncler.Mutation', {
    
    requires : [ 'apply', 'unapply', 'checkPrecondition' ],
    
    has : {
        objectUUID      : {
            required    : true 
        }
    },
    
    
    methods : {
        
        getObjectFrom : function (replica) {
            return replica.getObjectByID(this.objectUUID)
        }
    }
})

