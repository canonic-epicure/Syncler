Class('Syncler.Vero.Mutation', {
    
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

