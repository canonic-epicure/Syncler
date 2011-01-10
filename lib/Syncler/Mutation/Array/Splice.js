Class('Syncler.Mutation.Array.Splice', {
    
    does    : 'Syncler.Mutation',
    
    use     : 'Syncler.Mutation.Void',
    
    
    has : {
        startAt             : 0,
        removeCount         : 0,
        
        newValues           : Joose.I.Array,
        oldValues           : Joose.I.Array,
        
        label               : 'splice'
    },
    
    
    methods : {
        
        merge : function () {
            return new Syncler.Mutation.Void({ insteadOf : this })
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
            var object      = this.getObjectFrom(replica)
            var value       = object.value
            var oldValues   = this.oldValues
            var startAt     = this.startAt
            
            return (object instanceof Syncler.Composite.Array) 
                && value.length >= (startAt + this.removeCount) 
                && Joose.A.each(value.slice(startAt, startAt + this.removeCount), function (value, index) {
                    
                    if (value !== oldValues[ index ]) return false
                    
                }) !== false
        }
    }
})
