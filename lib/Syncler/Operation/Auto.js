Class('Syncler.Operation.Auto', {
    
    isa     : 'Syncler.Operation',
    
    has : {
        preconditions       : Joose.I.Array
    },
    
    
    methods : {
        
        unapply : function (replica) { 
            throw "Abstract method called"
        },
        
        
        checkPrecondition : function () {
            throw "Abstract method called"
        },
        
        
        merge : function () {
            throw "Abstract method called"
        }
    }
})

