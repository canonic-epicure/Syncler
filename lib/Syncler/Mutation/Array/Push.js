Class('Syncler.Mutation.Array.Push', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        newValues        : null,
        
        label           : 'push'
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void({ insteadOf : this })
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            var array       = object.value
            
            array.push.apply(array, this.newValues)
            
            object.fireEvent('mutation-push', object, this.newValues)
        },
        
        
        deRealize : function (replica) {
            var array       = this.getObjectFrom(replica).value
            var length      = this.newValues.length
            
            array.splice(array.length - length, length)
        },
        
        
        savePrecondition : function (replica) {
        },
        
        
        checkPrecondition : function (replica) {
            return this.hasLiveInstanceOf(replica, Syncler.Attribute.Array)
        }
    }
})
