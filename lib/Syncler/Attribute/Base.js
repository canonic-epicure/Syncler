Class('Syncler.Attribute.Base', {
    
    has : {
        host        : { required : true },
        value       : null
    },
    
    
    methods : {
        
        BUILD       : function (host, value) {
            var props = {
                host        : host
            }
            
            if (value) props.value = value
            
            return props
        },
        
        
        initialize : function () {
            
        }
    }
})