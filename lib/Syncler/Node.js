Class('Syncler.Node', {
    
    isa         : 'KiokuJS.Node',
    
//    does        : 'JooseX.Observable',
    
    
    has : {
//        UUID                    : Joose.I.UUID,
//        
//        object                  : null,
//        
//        
//        history                 : Joose.I.Array,
//        
//        state                   : 'transient',
//        
//        
//        currentPacket           : Joose.I.Array,
//        
//        syncler                 : { required : true }
    },
    
    
    methods : {
        
//        initialize : function () {
//            this.addEvents('mutate')
//            
//            this.channel.register(this)
//        },
//        
//        
//        addMutation : function (mutation) {
//            this.currentPacket.push(mutation)
//        },
//        
//        
//        commit      : function (type) {
//            var currentPacket = this.currentPacket
//            
//            if (currentPacket.length) {
//                
//                this.history.push(currentPacket)
//                
//                this.currentPacket = []
//                
//                this.fireEvent('mutate', this, currentPacket)
//            }
//        },
//        
//        
//        remove : function () {
//            this.addMutation(new Vero.Mutation.Delete({
//                objectUUID              : this.UUID
//            }))
//        }
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