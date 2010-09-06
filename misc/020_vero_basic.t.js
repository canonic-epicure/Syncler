StartTest(function(t) {
    
    //======================================================================================================================================================================================================================================================
    t.diag('Sanity')
    
    t.ok(Vero, "Vero is here")

    
    //======================================================================================================================================================================================================================================================
    t.diag('Class declaration')
    
    
    Class('TestClass', {
        
        trait   : Vero,
        
        has : {
            attr1 : {
                trait : Vero.Attribute,
                
                init    : 'attr1'
                
            },
            
            attr2 : {
                trait : Vero.Attribute
            },
            
            
            attr3 : {
                trait : Vero.Attribute
            }
        }
        
    })
    
    
    t.ok(TestClass, 'TestClass is here')
    
    
    //======================================================================================================================================================================================================================================================
    t.diag('Instantiation')
    
    var channel     = new Vero.Channel({
        url     : 'http://local/8080/faye'
    })
    
    var test = new TestClass({
        channel : channel,
        
        attr2   : 'attr2',
        attr3   : 'attr3'
    })
    
    
    var VERO = test.VERO
    
    t.ok(VERO, 'Vero instance was attached')
    
    t.ok(VERO.history.length == 1, 'History has 1 packet')
    
    t.ok(VERO.history[0] instanceof Array, 'Packet isa Array')
    
    
    var packet = VERO.history[0]
    
    t.ok(packet.length == 3, 'Packet has 2 mutations')
    
    var creation  = packet[ 0 ]
    
    t.ok(creation.objectUUID == VERO.UUID, 'Creation refer to correct VERO')
    
    var mutation0 = packet[ 1 ]
    var mutation1 = packet[ 2 ]
    
    t.ok(mutation0.attributeName == 'attr2' || mutation0.attributeName == 'attr3', 'Order is not guaranteed')
    t.ok(mutation1.attributeName == 'attr2' || mutation1.attributeName == 'attr3', 'Order is not guaranteed')
    
    t.ok(mutation1.objectUUID == VERO.UUID, 'Mutation refer to correct VERO')

    
    //======================================================================================================================================================================================================================================================
    t.diag('Mutation')
    
    test.setAttr1('mutate1')
    test.setAttr2('mutate2')
    
    test.commit()
        

    t.ok(VERO.history.length == 2, 'History has 1 packet')
    
    var packet = VERO.history[1]
    
    t.ok(packet.length == 2, 'Packet has 2 mutations')
    
    var mutation0 = packet[ 0 ]
    var mutation1 = packet[ 1 ]
    
    t.ok(mutation0.objectUUID == VERO.UUID, 'Correct UUID for mutation 0')
    t.ok(mutation0.attributeName == 'attr1', 'Correct attribute name for mutation 0')
    t.ok(mutation0.oldValue == 'attr1', 'Correct old value for mutation 0')
    t.ok(mutation0.newValue == 'mutate1', 'Correct new value for mutation 0')
    
    t.ok(mutation1.objectUUID == VERO.UUID, 'Correct UUID for mutation 1')
    t.ok(mutation1.attributeName == 'attr2', 'Correct attribute name for mutation 1')
    t.ok(mutation1.oldValue == 'attr2', 'Correct old value for mutation 1')
    t.ok(mutation1.newValue == 'mutate2', 'Correct new value for mutation 1')
    
    
    t.done()
})    
