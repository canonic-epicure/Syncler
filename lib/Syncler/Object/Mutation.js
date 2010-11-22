Class('Syncler.Object.Mutation', {
    
    has : {
        timestamp               : Joose.I.Now,
        
        object                  : {
            required    : true 
        }
    },
    
    
    methods : {
        
        activate : function (replica) {
        }
    }
})

