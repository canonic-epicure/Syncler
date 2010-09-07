Class('Syncler.Node.Mutation.Create', {
    
    isa     : 'Syncler.Node.Mutation',
    
    use     : 'Syncler.Node',
    
    
    has : {
        objectID        : {
            lazy : 'this.buildObjectID'
        }
    },
    
    
    methods : {
        
        buildObjectID : function () {
            
            return this.node.ID
        },
        
        
        activate : function (scope) {
//            var constructor = eval(this.className)
//            
//            var f               = function () {}
//            f.prototype         = constructor.prototype
//            
//            var instance = new f()
//            
//            var VERO = instance.VERO = new Vero.Object({
//                UUID        : this.objectUUID,
//                
//                state       : 'working',
//                
//                object      : instance,
//                
//                channel     : channel
//            })
//            
//            channel.fireEvent('newInstance', instance)
        }
    }
})
