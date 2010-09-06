Class('Syncler.Node', {
    
    isa         : 'KiokuJS.Node',
    
    
    does        : 'JooseX.Observable',
    
    
    has : {
        REV         : null
    },
    

    methods : {
        
        buildEntry   : function () {
            
            var entry = this.SUPER()
            
            if (entry.ID != null) {
                entry._id = entry.ID
                
                delete entry.ID
            }
            
            if (this.REV != null) entry._rev = this.REV
            
            return entry
        }
    },
    

    my : {
        
        methods : {
        
            newFromEntry : function (entry, resolver) {
                if (!entry) return null
                
                entry.resolver   = resolver
                
                entry.REV      = entry._rev
                entry.ID       = entry._id
                
                delete entry._rev
                delete entry._id
                
                return new this.HOST(entry)
            }
        }
    }
        
    
})