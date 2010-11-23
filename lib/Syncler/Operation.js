Class('Syncler.Operation', {
    
    trait       : 'JooseX.Class.SimpleConstructor',
    
    
    has : {
        clientID        : null,
        acceptNum       : null,
        
        mutations       : Joose.I.Array,
        
        mutate          : null,
        
        mergedFrom      : null
    },
    
    
    methods : {
        
        addMutation : function (mutation) {
            this.mutations.push(mutation)
        },
        
        
        // client-side run of `mutate`
        collect : function () {
        },
        
        
        activate : function (replica) {
            Joose.A.each(this.mutations, function (mutation) {
                
                mutation.activate(replica)
                
                replica.fireEvent('mutation', mutation)
            })
            
            replica.fireEvent('operation', this)
        },
        
        
        // application to replica (possibly from remote source)
        apply : function (replica) {
            if (!this.checkPrecondition(replica)) return this.merge(replica)
            
            this.activate(replica)
            
            return this
        },
        
        
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

