Class('Syncler', {
    
    /*VERSION,*/
    
    isa         : 'KiokuJS.Backend',
    
    does        : 'JooseX.Observable',
    
    
    use : [ 
        'Syncler.Node' 
    ],
    
    
    has : {
        nodeClass       : Joose.I.FutureClass('Syncler.Node')
        
    },
    
        
    methods : {
        
        commit      : function () {
            
            
        },
        
        
        rollback    : function () {
        }
    }
})