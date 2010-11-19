Class('Syncler.Vero', {
    
    does        : 'KiokuJS.Feature.Class.OwnUUID',
    
    has : {
        uuid    : function () { return 'Vero-' + Data.UUID.uuid() },
        
        object                  : { required : true },
        
        replica                 : { 
            required    : true,
            
            handles     : 'addMutation'
        }
    },
    
    
    
    methods : {
    }
})