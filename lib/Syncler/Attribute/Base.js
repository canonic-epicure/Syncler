Class('Syncler.Attribute.Base', {
    
    does            : 'Syncler.Object',
    
    has : {
        value       : null
    },
    
    
    methods : {
        
        BUILD       : function (replica, value) {
            var props = {
                replica     : replica
            }
            
            if (value) props.value = value
            
            return props
        }
    }
})