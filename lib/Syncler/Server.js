Class('Syncler.Server', {
    
    use         : [
        'Data.UUID',
        'Syncler' 
    ],
    
    
    isa         : 'KiokuJS.Backend.Batch.Server',
    
    does        : 'Syncler.PubSub.Faye',
    
    
    has : {
        fayeURL                 : { required : true },
        fayeClient              : { is : 'rw' },
        
        backendParamsStr        : null,
        
        channels                : Joose.I.Object
    },
    

    methods : {
        
        initialize : function () {
            this.backendParamsStr = JSON.stringify(this.backendParams || {})
            
            this.SUPER()
            
            var bayeux = new faye.NodeAdapter({
                mount       : fayeURL,
                timeout     : 45
            })

            bayeux.attach(this.app)
            
            this.fayeClient     = bayeux.getClient()
            
            this.subscribe('/vero/channel/new', this.onNewChannel, this)
        },
        
        
        
        onNewChannel : function (message) {
            var puts    = require('sys').puts
            
            var me      = this
            
            var topicID = message.topicID
            
            if (this.channels[ topicID ]) {
                puts('re-using existing channel')
                
                return
            }
            
            puts('Creating new channel, baseURL = ' + 'http://local/' + this.port)
            
            
            var params = JSON.parse(this.backendParamsStr)
            
            params.trait        = Syncler
            params.fayeClient   = this.fayeClient
            
            var syncler = new this.backendClass(params)
            
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
