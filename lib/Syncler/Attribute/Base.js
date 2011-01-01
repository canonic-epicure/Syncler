Class('Syncler.Attribute.Base', {
    
    does            : [
        'Syncler.Object',
        'KiokuJS.Feature.Class.OwnUUID'
    ],
    
    has : {
        value       : null,
        
        host        : null,
        name        : null
    },
    
    
    methods : {
        
        getBubbleTarget : function () {
            if (this.host) return this.host
            
            return this.replica
        }
    }
})