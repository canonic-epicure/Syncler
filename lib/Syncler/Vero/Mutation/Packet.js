Class('Syncler.Vero.Mutation.Packet', {
    
    does        : 'KiokuJS.Feature.Class.OwnUUID',
    
    has : {
        mutations               : Joose.I.Array
    },
    
    
    methods : {
        
        each : function (func, scope) {
            return Joose.A.each(this.mutations, func, scope)
        },
        
        
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



