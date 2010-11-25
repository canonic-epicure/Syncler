Class('Syncler.Operation.Auto', {
    
    does    : 'Syncler.Operation',
    
    use     : 'Syncler.Operation.Void',
    
    
    has : {
        mutations       : Joose.I.Array
    },
    
    
    methods : {
        
        addMutation : function (mutation) {
            this.mutations.push(mutation)
        },
        
        
        apply : function (replica) {
            throw "Abstract method called"
        },
        
        
        unapply : function (replica) { 
            throw "Abstract method called"
        },
        
        
        checkPrecondition : function () {
            throw "Abstract method called"
        },
        
        
        merge : function (replica) {
            return new Syncler.Operation.Void({
                mergeResultOf   : this
            })
        },
        
        
        each : function (func, scope) {
            return Joose.A.each(this.mutations, func, scope || this)
        },
        
        
        eachR : function (func, scope) {
            var mutations   = this.mutations
            scope           = scope || this
            
            for (var i = mutations.length - 1; i >= 0; i--) func.call(scope, mutations[i], i)
        }
    }
})

