Class('Syncler.Mutation.Array.Pop', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        popedValue      : null
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void()
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            this.popedValue = object.value.pop()
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            object.value.push(this.popedValue)
            
            delete this.popedValue
        },
        
        
        savePrecondition : function (replica) {
        },
        
        
        checkPrecondition : function (replica) {
            return this.getObjectFrom(replica) !== null
        }
    }
})
