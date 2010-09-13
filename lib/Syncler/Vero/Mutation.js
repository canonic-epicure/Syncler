Class('Syncler.Vero.Mutation', {
    
    has : {
        timestamp               : Joose.I.Date,
        
        state                   : 'transient',
        
        creator                 : null,
        
        object                  : {
            required    : true 
        }
    },
    
    
    methods : {
        
        activate : function (channel) {
        }
    }
})

