Class('Syncler.Operation.Void', {
    
    does    : 'Syncler.Operation',
    
    
    methods : {
        
        apply : function (replica) {
        },
        
        
        unapply : function (replica) { 
        },
        
        
        checkPrecondition : function () {
            return true
        },
        
        
        merge : function (replica) {
            throw new Error("`Void` operation should never conflict")
        },
        
        
        run : function (replica) {
            throw new Error("`Void` operation should never be `run`")
        }
    }
})

