Class('Syncler.Replica', {
    
    trait   : 'JooseX.CPS',
    
    use     : [
        'Data.UUID'
    ],
    
    does        : [
        'JooseX.Observable'
    ],

    
    has : {
        clientID                : function () { return Data.UUID.uuid() },
        
        acceptSeq               : 1,
        
        latestCommitNum         : null,
        
        tentativeQueue          : Joose.I.Array,
        tentativeIndex          : Joose.I.Object,
        
        committedQueue          : Joose.I.Array,
        
        
        scope                   : { 
            required    : true,
            
            handles     : [ /*'pinObjectAs',*/ 'pinObject', 'unpinID', 'objectToId', 'idToObject', 'getCount', 'idPinned' ]
        },
        
        topic                   : {
            handles     : 'getTopicID'
        },
        
        
        lastSent                : null
        
        
//        updating                : false,
//        idleTimeout             : null,
//        idleBuffer              : 100
    },
    
    
    methods : {
        
        // mutation should be already applied
        addMutation : function (mutation) {
            mutation.clientID   = this.clientID
            mutation.acceptNum  = this.acceptSeq++
            
            this.pushToTentative(mutation)
            
            this.fireEvent('mutation', this, mutation)
        },
        
        
        pushToTentative : function (mutation) {
            this.tentativeQueue.push(mutation)
            
            this.tentativeIndex[ mutation.acceptNum ] = mutation
        },
        
        
//        spliceFromTentative : function (mutation) {
//            this.tentativeQueue.push(mutation)
//            
//            this.tentativeIndex[ mutation.acceptNum ] = mutation
//        },
        
        
        write : function (spec) {
            var constructor = eval(spec.type)
            
            delete spec.type
            
            var mutation = new constructor(spec)
            
            mutation.savePrecondition(this)
            mutation.apply(this)
            
            this.addMutation(mutation)
        },
        
        
        set : function () {
        },
        
        
        setTopic : function (topic) {
            this.topic = topic
            
            this.scope.registerProxy(this, 'replica:' + this.getTopicID())
        },
        
        
        getTentativeMutation : function (acceptNum) {
            return this.tentativeIndex[ acceptNum ]
        },
        
        
        undoTentative : function () {
            var tentativeQueue = this.tentativeQueue
            
            for (var i = tentativeQueue.length - 1; i >= 0; i--) tentativeQueue[ i ].unapply(this, true)
        },
        
        
        redoTentative : function (count) {
            var me = this
            
            Joose.A.each(this.tentativeQueue, function (mutation) {
                
                mutation.apply(me, true)
            })
        },
        
        
        mutationCommutativeWithTentatives : function (sourceMutation) {
            var commutative     = true
            var me              = this
            
            Joose.A.each(this.tentativeQueue, function (mutation) {
                
                commutative = commutative && (mutation.commutativeWith(sourceMutation) || sourceMutation.commutativeWith(mutation))
                
                if (!commutative) return false
            })
            
            return commutative
        },
        
        
        
        
        
//        receiveMutation : function () {
//        },
//        
//        
//        sendUpdates : function (knownMutationsVector) {
//            
//            
//            
//            Joose.A.each(this.tentativeQueue, function (mutation) {
//                
//                
//            })
//        }
        
        
        
        
        
//        onIncomingUpdate : function (wrapper) {
//            console.log('INCOMING UPDATE by [' + this.pubsubUUID + ']: ' + JSON2.stringify(wrapper))
//            
//            this.fireEvent('update-incoming', this, wrapper)
//            
//            this.incomingQueue.push(wrapper)
//            
//            this.processIncomingPacket()
//        },
//        
//        
//        processIncomingPacket : function () {
//            var me          = this
//            
//            if (me.updating) return
//            
//            me.updating = true
//            
//            
//            if (me.idleTimeout) {
//                clearTimeout(me.idleTimeout)
//                
//                delete me.idleTimeout
//            }
//            
//            var wrapper     = me.incomingQueue.shift()
//            
//            TRY(function () {
//                
//                me.scope.animatePacket(wrapper.message).then(function (customIDs, mutations) {
//                    
//                    Joose.A.each(mutations, function (mutation) {
//                        mutation.activate(me)
//                        
//                        me.fireEvent('mutation', me, mutation.object, mutation)
//                    })
//                    
//                    me.processedQueue.push({
//                        wrapper     : wrapper,
//                        mutations   : mutations
//                    })
//                    
//                    if (wrapper.sender != me.pubsubUUID) {
//                        me.fireEvent('update-raw-message', me, wrapper)
//                        me.fireEvent('update-packet', me, mutations)
//                    }
//                    
//                    this.CONTINUE()
//                    
//                }).except(function (e) {
//                    
//                    console.log('UPDATE EXCEPTION: ' + e)
//                    
//                    
//                    me.fireEvent('update-exception', me, e)
//                    
//                    this.CONTINUE()
//                    
//                }).ensure(function () {
//                    
//                    me.updating = false
//                    
//                    if (me.incomingQueue.length) 
//                        me.processIncomingPacket()
//                    else
//                        me.idleTimeout = setTimeout(function () {
//                            delete me.idleTimeout
//                            
//                            if (!me.updating) me.fireEvent('update-idle', me)
//                        
//                        }, me.idleBuffer)
//                    
//                    this.CONTINUE()
//                    
//                }).now()
//                
//            }).now()
//            
//        }
        
    },
    // eof methods
    
    
    continued : {
        
        methods : {
            
            setup : function () {
                throw "Abstract method `setup` called for [" + this + "]" 
            }
        }
    }
    // eof continued
})