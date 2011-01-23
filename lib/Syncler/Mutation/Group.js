Class('Syncler.Mutation.Group', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        objectID        : null,
        
        group           : Joose.I.Array
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void({ insteadOf : this })
        },
        

        // handles in `checkPrecondition`
        realize : function (replica) {
        },
        
        
        deRealize : function (replica) {
            Joose.A.eachR(this.group, function (mutation) {
                
                mutation.unapply(replica)
            })
        },
        
        
        savePrecondition : function (replica) {
            Joose.A.each(this.group, function (mutation) {
                
                mutation.savePrecondition(replica)
            })
            
            // this will force replica to call the `apply` of the mutation with `preconditionsOk` set to false
            return false
        },
        
        
        checkPrecondition : function (replica, realizedInCheck) {
            var i   
            var precondition    = true
            var group           = this.group
            
            Joose.A.each(group, function (mutation, index) {
                i = index
                
                precondition = precondition && mutation.apply(replica)
                
                if (!precondition) return false
            })
            
            if (!precondition) 
                while (i--)
                    group[ i ].unapply(replica)
            else
                realizedInCheck.value = true
            
            return precondition
        }
    }
})

