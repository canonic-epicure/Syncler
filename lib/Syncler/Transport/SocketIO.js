Role('Syncler.Transport.SocketIO', {
    
    requires            : [ 'onSocketConnect', 'onSocketMessage', 'onSocketDisonnect' ],
    
    
    has : {
        socket              : {
            required    : true,
            
            handles     : [ 'connect', 'disconnect', 'send' ]
        }
    },
    
    
    after : {
        
        initialize : function () {
            var socket  = this.socket
            var me      = this
            
            socket.on('connect', function () {
                
                me.onSocketConnect.apply(me, arguments)
            }) 
            
            socket.on('message', function () {
                
                me.onSocketMessage.apply(me, arguments)
            }) 

            socket.on('disconnect', function () {
                
                me.onSocketDisonnect.apply(me, arguments)
            }) 
        }
    }
})