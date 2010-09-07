Class('Syncler.Node.Mutation.Packet', {
    
    does        : 'KiokuJS.Feature.Class.OwnUUID',
    
    has : {
        mutations               : Joose.I.Array
    },
    
    
    methods : {
        
        activate : function (scope) {
        },
        
        
        push : function (mutation) {
            this.mutations.push(mutation)
        },
        
        
        length : function () {
            return this.mutation.length
        }
    }
})



