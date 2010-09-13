Class('Syncler.Vero.Mutation.Packet', {
    
    has : {
        mutations               : Joose.I.Array
    },
    
    
    methods : {
        
        each : function (func, scope) {
            return Joose.A.each(this.mutations, func, scope)
        },
        
        
        activate : function (scope) {
        },
        
        
        at  : function (index) {
            return this.mutations[ index ]
        },
        
        push : function (mutation) {
            this.mutations.push(mutation)
        },
        
        
        length : function () {
            return this.mutations.length
        },
        
        
        // XXX include the object into packed instead of repeting it on each mutation
        getObject : function () {
            return this.mutations[0].object
        }
    }
})



