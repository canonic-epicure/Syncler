Class('Syncler.Node', {
    
    isa         : 'KiokuJS.Backend.CouchDB.Node',
    
//    does        : 'JooseX.Observable',
    
    
    has : {
        history                 : Joose.I.Array,
        
        state                   : 'transient',
        
        
        currentPacket           : Joose.I.Array,
        
        scope                 : { required : true }
    },
    
    
    after : {
        
        initialize : function () {
            this.scope.pinNode(this)
        }
    },
    
    
    methods : {
        
        addMutation : function (mutation) {
            this.currentPacket.push(mutation)
        },
        
        
        commit      : function (type) {
            var currentPacket = this.currentPacket
            
            if (currentPacket.length) {
                
                this.history.push(currentPacket)
                
                this.currentPacket = []
                
                this.fireEvent('mutate', this, currentPacket)
            }
        }
    },
    
    
    my : {
        
        methods : {
        
//            newFromEntry : function (entry, resolver) {
//                if (!entry) return null
//                
//                entry.resolver   = resolver
//                
//                entry.REV      = entry._rev
//                entry.ID       = entry._id
//                
//                delete entry._rev
//                delete entry._id
//                
//                return new this.HOST(entry)
//            },
//            
//            
//            newFromObject : function (object, resolver) {
//                if (object.NODE) return object.NODE
//                
//                return new this.HOST({
//                    object      : object,
//                    
//                    resolver    : resolver
//                })
//            }
            
        }
    }
    
    
})