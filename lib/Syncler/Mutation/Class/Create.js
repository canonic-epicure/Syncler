Class('Syncler.Mutation.Class.Create', {
    
    does   : 'Syncler.Mutation',
    
    
    has : {
        // XXX also take traits into account
        className       : undefined,
        
        attrValues      : Joose.I.Object,
        
        label           : 'create'
    },
    
    
    methods : {
        
        merge : function () {
            throw "`Create` mutation should not conflict"
        },
        
        
        realize : function (replica) {
            var instance        = replica.getObjectFromCache(this.objectID)
            
            replica.deleteFromCache(this.objectID)
            
            if (!instance) {
                var constructor     = eval(this.className)
                
                var f               = function () {}
                f.prototype         = constructor.prototype
                
                instance            = new f()
            }
            
            instance.replica    = replica
            
            var attrValues      = this.attrValues
            
            instance.meta.forEachStoredAttribute(function (attribute, name) {
                
                if (attrValues.hasOwnProperty(name)) attribute.setRawValueTo(instance, attrValues[ name ])
            })
            
            replica.pinObject(instance, this.objectID)
        },
        
        
        deRealize : function (replica) {
            var object      = this.getObjectFrom(replica)
            
            replica.unpinID(this.objectID)
            
            if (object) replica.addToRefsCache(object, this.objectID)
        },
        
        
        savePrecondition : function (replica) {
        },
        
        
        checkPrecondition : function (replica) {
            return !replica.idPinned(this.objectID)
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
