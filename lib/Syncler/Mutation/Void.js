Class('Syncler.Mutation.Void', {
    
    does    : 'Syncler.Mutation',
    
    has : {
        objectID        : null
    },
    
    
    methods : {
        
        realize : function (replica) {
        },
        
        
        deRealize : function (replica) { 
        },
        
        
        savePrecondition : function () {
        },
        
        
        checkPrecondition : function () {
            return true
        },
        
        
        merge : function (replica) {
            throw new Error("`Void` operation never conflict and should not be merged")
        },
        
        
        commutativeWith : function (mutation) {
            return true
        }
    }
})

