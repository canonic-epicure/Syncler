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
        committedIndex          : Joose.I.Object,
        
        objectsByID             : Joose.I.Object,
        
        refsCache               : Joose.I.Object,
        scope                   : { 
            required    : true,
            
            handles     : [ 'pinObject', 'unpinID', 'objectToId', 'idToObject', 'getCount', 'idPinned' ]
        },
        
        topic                   : {
            is          : 'rw',
            handles     : 'getTopicID'
        },
        
        listeningForCreate      : false
    },
    
    
    methods : {
        
        addObject : function (object, ID) {
            var id = this.pinObject(object, ID)
            
            this.objectsByID[ id ] = object
            
            return id
        },
        
        
        getInheritanceChainOf : function (classCtor) {
            if (Joose.O.isInstance(classCtor)) classCtor = classCtor.constructor
            
            // the joy of imperative programming
            for (var chain = []; classCtor != Joose.Meta.Object; classCtor = classCtor.meta.superClass) chain.unshift(classCtor.meta.name)
            
            return chain
        },
        
        
        onNewInstanceOf : function (className, handler, scope, options) {
            if (typeof className == 'function') {
                var classCtor = className
                
                className = className.meta.name
            } else
                classCtor = Joose.S.strToClass(className)
                
            // first subscription
            if (!this.listeningForCreate) {
                this.listeningForCreate = true
                
                this.on('/mutation/apply/create', function (e, mutation) {
                    
                    var object = mutation.getObjectFrom(this)
                    
                    this.fireEvent( [ '/create' ].concat(this.getInheritanceChainOf(object)).join('/') + '/', object)  
                    
                }, this)
            }
                
            this.on([ '/create' ].concat(this.getInheritanceChainOf(classCtor)).concat('**').join('/'), handler, scope, options)
        },
        
        // mutation should be already applied
        // mutation should originate from this replica itself (mutations from other replicas will come as commit notices)
        addMutation : function (mutation) {
            mutation.clientID   = this.clientID
            mutation.acceptNum  = this.acceptSeq++
            
            this.pushToTentative(mutation)
            
            this.fireEvent('/mutation/new', mutation)
        },
        
        
        // XXX seems we actually don't need the `committedIndex`
        pushToCommitted : function (mutation) {
            this.committedQueue.push(mutation)
            
            this.committedIndex[ mutation.commitNum ] = mutation
        },
        
        
        shiftFromCommitted : function (mutation) {
            var mutation = this.committedQueue.shift()
            
            delete this.committedIndex[ mutation.commitNum ]
            
            return mutation
        },
        
        
        pushToTentative : function (mutation) {
            this.tentativeQueue.push(mutation)
            
            this.tentativeIndex[ mutation.acceptNum ] = mutation
        },
        
        
        shiftFromTentative : function (mutation) {
            var mutation = this.tentativeQueue.shift()
            
            delete this.tentativeIndex[ mutation.acceptNum ]
            
            return mutation
        },
        
        
        getTentativeMutation : function (acceptNum) {
            return this.tentativeIndex[ acceptNum ]
        },
        
        
        getCommittedMutation : function (commitNum) {
            return this.committedIndex[ commitNum ]
        },
        
        
        write : function (spec) {
            var constructor = Joose.S.strToClass(spec.type)
            delete spec.type
            
            spec.objectID   = this.objectToId(spec.object)
            delete spec.object
            
            var mutation = new constructor(spec)
            
            mutation.savePrecondition(this)
            mutation.apply(this, true)
            
            this.addMutation(mutation)
            
            return mutation
        },
        
        
        setTopic : function (topic) {
            this.topic = topic
            
            this.scope.registerProxy(this, 'replica:' + this.getTopicID())
        },
        
        
        reset : function () {
            this.tentativeQueue     = []
            this.tentativeIndex     = {}
        },
        
        
        undoTentative : function () {
            var tentativeQueue = this.tentativeQueue
            
            for (var i = tentativeQueue.length - 1; i >= 0; i--) tentativeQueue[ i ].unapply(this)
        },
        
        
        redoTentative : function (count) {
            var me = this
            
            Joose.A.each(this.tentativeQueue, function (mutation) {
                
                mutation.apply(me)
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
        
        
        addToRefsCache : function (object, ID) {
            if (this.refsCache[ ID ]) throw "ID [" + ID + "] is already taken in the reference cache"
            
            this.refsCache[ ID ] = object
            
            Joose.O.eachOwn(object, function (value, key) {
                
                delete object[ key ]
            })
        },
        
        
        getObjectFromCache : function (ID) {
            return this.refsCache[ ID ]
        },
        
        
        deleteFromCache : function (ID) {
            delete this.refsCache[ ID ]
        }
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