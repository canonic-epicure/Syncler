Role('Syncler.Mutation', {
    
    requires : [ 'apply', 'unapply', 'checkPrecondition', 'commit' ],
    
    has : {
        clientID        : null,
        acceptNum       : null,
        
        mergeResultOf   : null,
        
        object          : { required : true },
        objectUUID      : null
    },
    
    
    methods : {
        
        commit : function (replica) {
            this.objectUUID = replica.pinObject(this.object)
        },
        
        
        getObjectFrom : function (replica) {
            return replica.getObjectByID(this.objectUUID)
        }
    }
})




Class('Syncler.Operation.Auto', {
    
    does    : 'Syncler.Operation',
    
    use     : 'Syncler.Operation.Void',
    
    
    has : {
        mutations       : Joose.I.Array,
        
        code            : null
    },
    
    
    methods : {
        
        addMutation : function (mutation) {
            this.mutations.push(mutation)
        },
        
        
        commit : function (replica) {
            this.each(function (mutation) {
                
                mutation.commit(replica)
            })
        },
        
        
        apply : function (replica) {
            this.each(function (mutation) {
                
                mutation.apply(replica)
            })
        },
        
        
        unapply : function (replica) { 
            this.eachR(function (mutation) {
                
                mutation.unapply(replica)
            })
        },
        
        
        checkPrecondition : function (replica) {
            var res = this.each(function (mutation) {
                if (!mutation.checkPrecondition(replica)) return false
            })
            
            return res === false ? false : true
        },
        
        
        merge : function (replica) {
            return new Syncler.Operation.Void({
                mergeResultOf   : this
            })
        },
        
        
        run : function () {
            this.code.call(this)
        },
        
        
        each : function (func, scope) {
            return Joose.A.each(this.mutations, func, scope || this)
        },
        
        
        eachR : function (func, scope) {
            var mutations   = this.mutations
            scope           = scope || this
            
            for (var i = mutations.length - 1; i >= 0; i--) 
                if (func.call(scope, mutations[i], i) === false) return false
        }
    }
})

