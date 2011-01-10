Class('Syncler.Composite', {
    
    does            : [
        'Syncler.Object',
        'KiokuJS.Feature.Class.OwnUUID'
    ],
    
    has : {
        // the `value` attribute MUST be instrinsic (and should have this trait in all subclasses)
        // it must reside in the same entry as the instance of Syncler.Composite itself to be persistent
        value       : {
            trait   : 'KiokuJS.Feature.Attribute.Intrinsic'
        },
        
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