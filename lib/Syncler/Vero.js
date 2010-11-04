Class('Syncler.Vero', {
    
    has : {
        object                  : { required : true },
        
        channel                 : { 
            required    : true,
            
            handles     : 'addMutation'
        }
    },
    
    
    
    methods : {
    }
})