Class('Syncler.Attribute.Array', {
    
    isa : 'Syncler.Attribute.Base',
    
    use : [
        'Syncler.Mutation.Array.Set',
        'Syncler.Mutation.Array.Push',
        'Syncler.Mutation.Array.Splice'
    ],
    
    
    has : {
        value       : Joose.I.Array
    },
    
    
    methods : {
        
        get : function (index) {
            return this.value[ index ]
        },
        
        
        set : function (index, newValue) {
            var value       = this.value
            var replica     = this.replica
            
            replica.acceptMutation(new Syncler.Mutation.Array.Set({
                objectID    : replica.objectToId(this),
                
                index       : index,
                oldValue    : value[ index ],
                newValue    : newValue
            }))
            
            value[ index ] = newValue
        },
        
        
        count : function () {
            return this.value.length
        },
        
        
        length : function () {
            return this.value.length
        },
        
        
        isEmpty  : function () {
            return this.value.length == 0
        },
        
        
        push  : function () {
            var value       = this.value
            var replica     = this.replica
            
            replica.acceptMutation(new Syncler.Mutation.Array.Push({
                objectID    : replica.objectToId(this),
                
                newValues   : Array.prototype.slice.call(arguments)
            }))
            
            return value.push.apply(value, arguments)
        },
        
        
        pop  : function () {
            return this.value.pop(value)
        },
        
        
        // shift and unshift should have own mutation classes?
        shift  : function () {
            return this.splice(0, 1)[0]
        },

        
        unshift  : function () {
            var args = Array.prototype.slice.call(arguments)
            
            args.unshift(0, 0)
            
            this.splice.apply(this, args)
            
            return this.value.length
        },

        
        splice  : function (startAt, removeCount) {
            var value       = this.value
            var replica     = this.replica
            
            replica.acceptMutation(new Syncler.Mutation.Array.Splice({
                objectID    : replica.objectToId(this),
                
                startAt     : startAt,
                removeCount : removeCount || 0,
                
                oldValues   : value.slice(startAt, startAt + removeCount - 1),
                newValues   : Array.prototype.slice.call(arguments, 2)
            }))
            
            return value.splice.apply(value, arguments)
        }
    }
})