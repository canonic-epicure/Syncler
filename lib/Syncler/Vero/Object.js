Class('Syncler.Vero.Object', {
    
    meta        : Joose.Meta.Class,
    
    isa         : Ext.util.Observable,
    
    
    has : {
        UUID                    : Joose.I.UUID,
        
        object                  : null,
        
        
        history                 : Joose.I.Array,
        
        state                   : 'transient',
        
        
        currentPacket           : Joose.I.Array,
        
        channel                 : { required : true }
    },
    
    
    methods : {
        
        initialize : function () {
            this.addEvents('mutate')
            
            this.channel.register(this)
        },
        
        
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
        },
        
        
        remove : function () {
            this.addMutation(new Vero.Mutation.Delete({
                objectUUID              : this.UUID
            }))
        }
    }
})

