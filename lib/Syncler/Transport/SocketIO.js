Role('Syncler.Transport.SocketIO', {
    
    
    has : {
        socket                    : function () { return Data.UUID.uuid() }
    },
    

    methods : {
        
        send : function (message) {
        },
        
        
        receive : function (message) {
        }
    }
})

