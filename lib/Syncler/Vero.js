Class('Syncler.Vero', {
    
    use         : [
        'Syncler.Vero.Mutation.Packet'
    ],
    
    
    has : {
        object                  : { required : true },
        channel                 : { required : true },
        
        history                 : {
//            trait       : KiokuJS.Feature.Attribute.Skip,
            
            init        : Joose.I.Array
        },
        
        state                   : 'transient',
        
        
        currentPacket           : {
            trait       : KiokuJS.Feature.Attribute.Skip,
            
            init        : function () { return new Syncler.Vero.Mutation.Packet() }
        }
    },
    
    
    
    methods : {
        
        initialize : function () {
            this.channel.registerVero(this)
        },
        
        
        addMutation : function (mutation) {
            if (!this.currentPacket) this.currentPacket = new Syncler.Vero.Mutation.Packet()
            
            this.currentPacket.push(mutation)
        },
        
        
        commit      : function () {
            var currentPacket = this.currentPacket
            
            if (currentPacket.length()) {
                
                this.history.push(currentPacket)
                
                this.currentPacket = new Syncler.Vero.Mutation.Packet()
                
                this.channel.onVeroCommit(this, currentPacket)
            }
        }
    }
})