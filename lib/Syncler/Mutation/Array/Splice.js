Class('Syncler.Mutation.Array.Splice', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        startAt             : 0,
        removeCount         : 0,
        
        newValues           : Joose.I.Array,
        oldValues           : Joose.I.Array
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void()
        },
        
        
        realize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            var args        = this.newValues.slice()
            
            args.unshift(this.startAt, this.removeCount)
            
            return object.value.splice.apply(object.value, args)
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica)
            var length      = this.newValues.length
            
            object.value.splice(this.startAt, length)
        },
        
        
        savePrecondition : function (replica) {
            var array       = this.getObjectFrom(replica).value
            
            this.oldValues  = array.slice(this.startAt, this.startAt + this.removeCount - 1)
        },
        
        
        checkPrecondition : function (replica) {
            return this.getObjectFrom(replica) !== null
        }
    }
})
