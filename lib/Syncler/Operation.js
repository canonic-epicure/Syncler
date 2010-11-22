Class('Syncler.Operation', {
    
    trait       : 'JooseX.Class.SimpleConstructor',
    
    
    has : {
        clientID        : null,
        
        acceptNum       : null,
        
        mutations       : Joose.I.Array
    },
    
    
    methods : {
        
        addMutation : function (mutation) {
            this.mutations.push(mutation)
        },
        
        
        apply : function (replica) {
            if (!this.checkPrecondition(replica)) return this.merge(replica)
        },
        
        
        unapply : function (replica) {
        },
        
        
        checkPrecondition : function () {
            throw "Abstract method called"
        },
        
        
        merge : function () {
            throw "Abstract method called"
        }
    }
})

