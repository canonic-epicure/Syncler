Class('Syncler.Mutation.Array.Push', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        newValues        : null
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void()
        },
        
        
        realize : function (replica) {
            var array      = this.getObjectFrom(replica).value
            
            array.push.apply(array, this.newValues)
        },
        
        
        deRealize : function (replica) {
            var array       = this.getObjectFrom(replica).value
            var length      = this.newValues.length
            
            array.splice(array.length - length, length)
        },
        
        
        savePrecondition : function (replica) {
        },
        
        
        checkPrecondition : function (replica) {
            return this.getObjectFrom(replica) !== null
        }
    }
})
