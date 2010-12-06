Class('Syncler.Replica.Client', {
    
    isa     : 'Syncler.Replica',
    
    does    : 'Syncler.Transport.SocketIO',
    
    use     : 'Syncler.Topic',
    
    
    has : {
        isSettingUp     : false,
        setupCONT       : null,
        setupParams     : null
    },
    
    
    methods : {
        
        onSocketConnect : function () {
            if (this.isSettingUp) {
                
                var topic       = config.topic
                
                if (topic) 
                    this.createTopic(topic)
                else
                    if (config.topicID)
                        this.fetchTopic(config.topicID)
                
            }
        },
        
            
        onSocketMessage : function (message) {
            if (this.isSettingUp) {
                this.isSettingUp = false

                var setupCONT = this.setupCONT
                delete this.setupCONT
                
                if (message.type == 'createTopic-result') {
                    setupCONT.CONTINUE(this)
                    
                    return
                }
                
                
                if (message.type == 'fetchTopic-result') {
                    var me  = this
                    
                    TRY(this.scope).animatePacket(topicPacket).then(function (object, array) {
                        
                        me.setTopic(array[0])
                        
                        setupCONT.CONTINUE(me)
                        
                    }).except(function (e) {
                        
                        setupCONT.THROW(e)
                        
                    }).now()
                }
            } else {
                
                
            }
        },
        
            
        onSocketDisonnect : function () {
            if (this.isSettingUp) {
                this.isSettingUp = false
                
                var setupCONT = this.setupCONT
                delete this.setupCONT
                
                setupCONT.THROW("Connection error")
            }
        },
        
        
        createTopic : function (topic) {
            
            if (!topic.meta.does(Syncler.Topic)) throw "Topic doesn't implement a `Syncler.Topic` role"
            
            this.setTopic(topic)

            
            var topicPacket     = scope.includeNewObjects({}, [ topic ])
            
            topicPacket.topicID = topic.getTopicID()
            topicPacket.type    = 'createTopic'
            
            this.send(topicPacket)
        },
        
        
        fetchTopic : function (topicID) {
            if (this.topic) throw "Already have topic [" + this.topic.getTopicID() + "] and trying to fetch another one"
            
            this.scope.registerProxy(this, 'replica:' + topicID)
            
            this.send({
                type    : 'fetchTopic',
                topicID : topicID
            })
        }
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function (config) {
                if (this.isSettingUp) throw "Double setup"
                
                this.isSettingUp    = true
                
                this.setupCONT      = this.CONT
                this.setupParams    = config
                
                this.connect()
            }
        }
    }
    // eof continued
    
})