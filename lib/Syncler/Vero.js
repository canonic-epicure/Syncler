Class('Syncler.Vero', {
    
    does        : 'KiokuJS.Feature.Class.OwnUUID',
    
    has : {
        uuid    : function () { return 'Vero-' + Data.UUID.uuid() },
        
        object                  : { required : true },
        
        channel                 : { 
            required    : true,
            
            handles     : 'addMutation'
        }
    },
    
    
    
    methods : {
    }
})