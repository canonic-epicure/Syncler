Role('Syncler.Client', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler'
    ],
    
    
    use     : [
        'Syncler.Replica.Client',
        
        {
            type        : 'javascript',
            token       : 'Syncler/static/deps/socket.io/socket.io.js',
            presence    : function () { return window.io && io.Socket }
        }
    ],
    
    
    has     : {
        host        : function () { return document.domain },
        port        : 80,
        resource    : 'socket.io'                 
    },
    
    
    methods : {
        
        newReplica : function (args) {
            args                = args || {} 
            args.scope          = this.newScope()
            
            args.socketClient   = new io.Socket(this.host, { 
                port        : this.port, 
                resource    : this.resource,
                
                transports  : [ 
                    'websocket',
                    'flashsocket'
//                    'xhr-multipart'
//                    'xhr-polling' 
                ]
            })
            
            return new Syncler.Replica.Client(args)
        }
    },
    
    
    body : function () {
        WEB_SOCKET_SWF_LOCATION = '/jsan/Syncler/static/deps/socket.io/WebSocketMain.swf'
    }
})
