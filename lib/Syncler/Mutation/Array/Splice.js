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
            var array       = this.getObjectFrom(replica).value
            
            var args        = [ this.startAt, this.removeCount ].concat(this.newValues)
            
            this.oldValues  = array.splice.apply(array, args)
        },
        
        
        deRealize : function (replica) {
            var array       = this.getObjectFrom(replica).value
            var args        = [ this.startAt, this.newValues.length ].concat(this.oldValues)
            
            array.splice.apply(array, args)
        },
        
        
        savePrecondition : function (replica) {
            var array       = this.getObjectFrom(replica).value
            
            this.oldValues  = array.slice(this.startAt, this.startAt + this.removeCount)
        },
        
        
        checkPrecondition : function (replica) {
            return this.getObjectFrom(replica) !== null
        }
    }
})
