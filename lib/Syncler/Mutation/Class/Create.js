Class('Syncler.Mutation.Class.Create', {
    
    does   : 'Syncler.Mutation',
    
    
    has : {
        objectUUID      : {
        },
        
        // XXX also take traits into account
        className       : undefined,
        
        config          : null
    },
    
    
    methods : {
        
        apply : function (replica) {
            var constructor     = eval(this.className)
            
            var f               = function () {}
            f.prototype         = constructor.prototype
            
            var obj             = new f()
            
            obj.meta.initInstance(obj, this.config)
            
            replica.pinObject(obj, this.objectUUID)
        },
        
        
        unapply : function (replica) {
            replica.unpinID(this.objectUUID)
        },
        
        
        checkPrecondition : function (replica) {
            return this.getObjectFrom(replica) === null
        }
    }
})


//        apply : function (replica) {
//            var constructor     = eval(this.className)
//            
//            var classVersion    = constructor.meta.VERSION
//            
//            if (this.objTraits) {
//                var traits = Joose.A.map(this.objTraits, function (traitOrDesc) {
//                    if (typeof traitOrDesc == 'string') return eval('(' + traitOrDesc + ')')
//                    
//                    return eval('(' + traitOrDesc.token + ')')
//                })
//                
//                constructor = constructor.meta.subClass({
//                    does : traits 
//                }, node.className)
//                
//                constructor.meta.isDetached = true
//            }
//            
//            var f               = function () {}
//            f.prototype         = constructor.prototype
//            
//            replica.pinObject(new f(), this.objectUUID)
//        },
