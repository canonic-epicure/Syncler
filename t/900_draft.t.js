Class('TestClass', {
    
    trait   : Syncler.Vero,
    
    does    : 'Syncler.Hub',
    
    
    vero : {
        attr1 : {
            init    : 'attr1'
        },
        
        attr2 : {
        },
        
        
        attr3 : {
            consistency         : 'lastWin', // only supported for now
            
            connection          : 'strong' // mutation will cause mutation of owner             
        }
    },
    
    
    has : {
        
        uuid        : Joose.I.UUID,
        
        attr4 : {
            trait   : Syncler.Vero.Attribute
        }
    },
    
    
    methods : {
        
        getChannelName  : function () {
            
            return '/board/' + this.uuid
        }
    }
    
})


// client1
var syncler1 = new Syncler({
    
    baseURL         : '/syncler'
})
    

// client2
var syncler2 = new Syncler({
    
    baseURL         : '/syncler'
})



var test = new TestClass({
    syncler : syncler1,
    
    attr2   : 'attr2'
})


test.setAttr3(new Another.Vero.Class({
    
    hub         : test
    
    
}))
        
    
syncler1.commit()
        
        
        
syncler2.on('newInstance', function (instance) {
    
    // instance ~~ test
    
})


channel2.on('mutation', function (instance, packet, channel) {
})
        
        
