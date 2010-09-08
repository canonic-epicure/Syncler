Class('Syncler.Vero', {
    
    does        : 'JooseX.Observable',
    
    
    use         : [
        'Syncler.Vero.Mutation.Packet'
    ],
    
    
    has : {
        object                  : { required : true },
        
        history                 : Joose.I.Array,
        
        state                   : 'transient',
        
        
        currentPacket           : function () { return new Syncler.Vero.Mutation.Packet() },
        
        scope                   : {
            trait       : KiokuJS.Feature.Attribute.Skip,
            
            required    : true 
        }
    },
    
    
//    after : {
//        
//        initialize : function () {
//            this.scope.pinNode(this)
//        }
//    },
    
    
    methods : {
        
        addMutation : function (mutation) {
            this.currentPacket.push(mutation)
        },
        
        
        commit      : function (type) {
            var currentPacket = this.currentPacket
            
            if (currentPacket.length()) {
                
                this.history.push(currentPacket)
                
                this.currentPacket = new Syncler.Vero.Mutation.Packet()
                
                this.fireEvent('mutate', this, currentPacket)
            }
        }
    }
})