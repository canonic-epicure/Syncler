Role('Syncler.Mutation', {
    
    requires : [ 'apply', 'unapply', 'checkPrecondition', 'commit' ],
    
    has : {
        object          : { required : true },
        objectUUID      : null
    },
    
    
    methods : {
        
        commit : function (replica) {
            this.objectUUID = replica.pinObject(this.object)
        },
        
        
        getObjectFrom : function (replica) {
            return replica.getObjectByID(this.objectUUID)
        }
    }
})

