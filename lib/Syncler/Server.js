Class('Syncler.Server', {
    
    isa         : 'KiokuJS.Backend.Batch.Server',
    
//    use         : [ 'Syncler' ],
    
    has : {
        fayeURL                 : { required : true },
        
        uuid                    : Joose.I.UUID,
        
        channels                : Joose.I.Object
    },
    

    methods : {
        
        initialize : function () {
            this.SUPER()
            
            var bayeux = new faye.NodeAdapter({
                mount       : fayeURL,
                timeout     : 45
            })

            bayeux.attach(app)
            
            this.subscribe('/vero/channel/new', this.onNewChannel, this)
        },
        
        
        
        onNewChannel : function (message) {
            var me      = this
            
            var topicID = message.topicID
            
            var sys     = require('sys')
            var puts    = sys.puts
            
            if (this.channels[ topicID ]) {
                puts('re-using existing channel')
                
                return
            }
            
            puts('creating new channel, baseURL = ' + 'http://local/' + this.port)
            
            var syncler = new Syncler({
                baseURL         : 'http://local/' + this.port,
                fayeClient      : this.fayeClient
            })
            
            puts('syncler created')
            
            puts('topicID = ' + topicID)
            
            syncler.establishChannel(topicID, true).then(function (channel) {
                
                var topic = channel.getTopic()
                var scope = channel.scope
                
                puts('channel established')
                puts('Topic rev: ' + scope.objectToNode(topic).REV)
                
                me.setupChannel(channel)
                
            }).except(function (e) {
                
                puts('ERROR = ' + e)
            
            }).now()
        },
        
        
        
        setupChannel : function (channel) {
            var topicID = channel.getTopic().getTopicID()
            
            this.channels[ topicID ] = channel
            
            channel.on('update', this.persistChannel, this)
        },
        
        
        persistChannel : function (channel) {
            
            channel.saveTopic()
            
//            
//            
//            console.log('Saving topic of the channel')
//
//            var sys     = require('sys')
//            var puts    = sys.puts
//            
//            var topic = channel.getTopic()
//            var scope = channel.scope
//                
//            puts('Topic rev: ' + scope.objectToNode(topic).REV)
//            
//            debugger
//            
//            channel.scope.store(channel.getTopic()).except(function (e) {
//                
//                debugger
//                
//                console.log('Error during saving topic: ' + e)
//                
//            }).then(function () {
//                
//                console.log('Saved topic successfully')
//                
//                puts('Topic rev: ' + scope.objectToNode(topic).REV)
//                
//            }).now()
        },
        
    
        subscribe : function (channel, func, scope) {
            var me = this
            
            this.fayeClient.subscribe(channel, function (wrapper) {
                
                if (wrapper.sender == me.uuid) return
                
                func.call(scope || me, wrapper.message)
            })
        },
        
        
        publish : function (channel, message) {
            
            console.log('PUBLISH FROM SERVER')
            
            var wrapper = {
                sender  : this.uuid,
                
                message : message
            }
            
            this.fayeClient.publish(channel, wrapper)
        }
    },
    
    
    continued : {
        
        methods : {
            
            onCommit : function () {
                this.CONTINUE()
            }
        }
    }
})
