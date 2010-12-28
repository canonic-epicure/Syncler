Class('Syncler.Attribute.Array', {
    
    isa : 'Syncler.Attribute.Base',
    
    use : [
        'Syncler.Mutation.Array.Set',
        'Syncler.Mutation.Array.Push',
        'Syncler.Mutation.Array.Pop',
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
            
            if (index < 0 || index >= value.length) throw new Error("Incorrect index for `set` mutation - out of array borders")
            
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
            
            var res         = value.push.apply(value, arguments)
            
            this.fireEvent('mutation-push', this, Array.prototype.slice.call(arguments))
            
            return res
        },
        
        
        pop  : function () {
            var value       = this.value
            var replica     = this.replica
            
            replica.acceptMutation(new Syncler.Mutation.Array.Pop({
                objectID        : replica.objectToId(this),
                popedValue      : value[ value.length - 1]
            }))
            
            return value.pop()
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
            
            removeCount     = removeCount || 0
            
            replica.acceptMutation(new Syncler.Mutation.Array.Splice({
                objectID    : replica.objectToId(this),
                
                startAt     : startAt,
                removeCount : removeCount,
                
                oldValues   : value.slice(startAt, startAt + removeCount),
                newValues   : Array.prototype.slice.call(arguments, 2)
            }))
            
            return value.splice.apply(value, arguments)
        },
        
        
        slice : function () {
            return new this.constructor(this.replica, this.value.slice.apply(this.value, arguments))
        },
        
        
        concat : function () {
            return new this.constructor(this.replica, this.value.concat.apply(this.value, arguments))
        },
        
        
        each : function (func, scope) {
            return Joose.A.each(this.value, func, scope)
        },
        
        
        eachR : function (func, scope) {
            var value   = this.value
            
            for (var i = value.length; i; i--) func.call(scope, value[ i ], i, this)
        }
    }
})