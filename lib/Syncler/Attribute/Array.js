Class('Syncler.Attribute.Array', {
    
    isa : 'Syncler.Attribute.Base',
    
    
    has : {
        value       : Joose.I.Array
    },
    
    
    methods : {
        
        get : function (index) {
            return this.value[ index ]
        },
        
        
        set : function (index, newValue) {
            var value   = this.value
            
            this.host.addMutation(new Syncler.Mutation.Array.Set({
                object      : value,
                
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
            this.host.addMutation(new Syncler.Mutation.Array.Push({
                index       : index,
                oldValue    : value[ index ],
                newValue    : value
            }))
            
            return this.value.push(value)
        },
        
        
        pop  : function () {
            return this.value.pop(value)
        },
        
        
        shift  : function () {
            return this.splice(0, 1)[0]
        },

        
        unshift  : function () {
            var args = Array.prototype.slice.call(arguments)
            
            args.unshift(0, 0)
            
            this.splice.apply(this, args)
            
            return this.value.length
        },

        
        splice  : function () {
        }
    }
})