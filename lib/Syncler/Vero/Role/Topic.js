Role('Syncler.Vero.Role.Topic', {
    
    use         : 'Data.UUID',
    
    does        : [
        'KiokuJS.Feature.Class.OwnID'
    ],
    
    requires    : [ 'getUuid' ],
    
    
    has         : {
        
        uuid    : {
            is      : 'rw',
            init    : function () { return Data.UUID.uuid() }
        }
    },
    
    
    
    methods : {
        
        acquireID : function () {
            return this.getUuid()
        }
    }
})

