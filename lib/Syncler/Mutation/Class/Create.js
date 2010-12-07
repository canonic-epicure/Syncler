Class('Syncler.Mutation.Class.Create', {
    
    does   : 'Syncler.Mutation',
    
    
    has : {
        // XXX also take traits into account
        className       : undefined,
        
        attrValues      : Joose.I.Object
    },
    
    
    methods : {
        
        merge : function () {
            throw "`Create` mutation should not conflict"
        },
        
        
        realize : function (replica) {
            var constructor     = eval(this.className)
            
            var f               = function () {}
            f.prototype         = constructor.prototype
            
            var instance        = new f()
            
            instance.replica    = replica
            
            var attrValues      = this.attrValues
            
            instance.meta.forEachStoredAttribute(function (attribute, name) {
                
                attribute.setRawValueTo(instance, attrValues[ name ])
            })
            
            replica.pinObject(instance, this.objectID)
        },
        
        
        deRealize : function (replica) {
            replica.unpinID(this.objectID)
        },
        
        
        savePrecondition : function (replica) {
        },
        
        
        checkPrecondition : function (replica) {
            return replica.idPinned(this.objectID) == false
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
