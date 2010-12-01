Class('Syncler.Replica', {
    
    trait   : 'JooseX.CPS',
    
    use     : [
        'Data.UUID',
        'Syncler.Operation.Auto'
    ],
    
    does        : [
        'JooseX.Observable'
    ],

    
    has : {
        clientID                : function () { return Data.UUID.uuid() },
        
        acceptSeq               : 1,
        
        tentativeQueue          : Joose.I.Array,
        tentativeIndex          : Joose.I.Object,
        
        committedQueue          : Joose.I.Array,
        
        
        defaultOpClass          : Joose.I.FutureClass('Syncler.Operation.Auto'),
        currentOp               : null,
        
        scope                   : { 
            required    : true,
            
            handles     : [ 'pinObject', 'unpinID' ]
        }
//        
//        topic                   : {
//            is          : 'rw',
//            handles     : 'getTopicID'
//        },
        
        
//        updating                : false,
//        idleTimeout             : null,
//        idleBuffer              : 100
    },
    
    
    methods : {
        
        addMutation : function (mutation) {
            if (!this.currentOp) this.currentOp = new this.defaultOpClass({ clientID : this.clientID })
            
            this.currentOp.addMutation(mutation)
        },
        
        
        commit : function () {
            var currentOp = this.currentOp
            
            if (!currentOp) throw new Error("No current operation - can't commit")
            
            delete this.currentOp
            
            currentOp.acceptNum = this.acceptSeq++
            
            this.fireEvent('tentative-commit', this, currentOp)
            
            return currentOp
        },
        
        
        write : function (op) {
            if (this.currentOp) this.commit()
            
            op.clientID    = this.clientID
            
            this.currentOp  = op
            
            op.run()
            
            this.commit()
        },
        
        
        getObjectByID : function (ID) {
            return this.scope.idToObject(ID) || null
        }
        
        
        
        
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
            
//            subscribeOnIncomingUpdates : function (topicID) {
//                this.subscribeRaw(this.getIncomingReplicaName(topicID), this.onIncomingUpdate, this)
//                
//                // timeout to emulate "durable" subscribe
//                // http://groups.google.com/group/faye-users/browse_thread/thread/12a9389c2b05bac8/7ab8ee9185d5c0d5#7ab8ee9185d5c0d5
//                setTimeout(this.getCONTINUE(), 10)
//            },
//            
//            
//            setup : function () {
//                throw "Abstract method `setup` called for [" + this + "]" 
//            }
        }
    }
    // eof continued
})