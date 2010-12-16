Class('Syncler.Attribute.Object', {
    
    isa : 'Syncler.Attribute.Base',
    
    use : [
        'Syncler.Mutation.Object.Set',
        'Syncler.Mutation.Object.Remove'
    ],
    
    
    has : {
        value       : Joose.I.Object
    },
    
    
    methods : {
        
        get : function (key) {
            return this.value[ key ]
        },
        
        
        set : function (key, newValue) {
            var value       = this.value
            var replica     = this.replica
            
            replica.acceptMutation(new Syncler.Mutation.Object.Set({
                objectID    : replica.objectToId(this),
                
                key         : key,
                
                hasOldValue : value.hasOwnProperty(key),
                oldValue    : value[ key ],
                
                newValue    : newValue
            }))
            
            value[ key ] = newValue
        },
        
        
        hasOwnKey : function (key) {
            return this.value.hasOwnProperty(key)
        },
        
        
        remove : function (key) {
            var value       = this.value
            
            if (value.hasOwnProperty(key)) {
                
                var replica     = this.replica
                
                replica.acceptMutation(new Syncler.Mutation.Object.Remove({
                    objectID    : replica.objectToId(this),
                    
                    key         : key,
                    
                    oldValue    : value[ key ]
                }))
                
                delete value[ key ]
            }
        },
        
        
        count : function (ownOnly) {
            var count = 0
            
            Joose.O[ ownOnly ? 'eachOwn' : 'each' ](this.value, function () {
                count++
            })
            
            return count
        },
        
        
        length : function (ownOnly) {
            return this.count(ownOnly)
        },
        
        
        keys : function (ownOnly) {
            var keys = []
            
            Joose.O[ ownOnly ? 'eachOwn' : 'each' ](this.value, function (value, name) {
                keys.push(name)
            })
            
            return keys
        },
        
        
        values : function (ownOnly) {
            var values = []
            
            Joose.O[ ownOnly ? 'eachOwn' : 'each' ](this.value, function (value, name) {
                values.push(value)
            })
            
            return values
        },
        
        
        kv  : function (ownOnly) {
            var res = []
            
            Joose.O[ ownOnly ? 'eachOwn' : 'each' ](this.value, function (value, name) {
                res.push({
                    key     : name,
                    value   : value
                })
            })
            
            return res
        },
        
        
        isEmpty  : function (ownOnly) {
            return !this.count(ownOnly)
        }
    }
})