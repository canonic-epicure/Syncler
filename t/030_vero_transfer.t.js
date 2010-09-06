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
    t.diag('Instantiating channels')
    
    var channel1    = new Vero.Channel({
        url     : 'http://local/8080/faye'
    })

    var channel2     = new Vero.Channel({
        url     : 'http://local/8080/faye'
    })
    
    
    var instanceTransfered  = false
    var instanceMutated     = false
    var instanceMutatedBack = false

    var async1 = t.beginAsync()
    
    // delay to give both channels time to establish a connection
    setTimeout(function () {
        
        //======================================================================================================================================================================================================================================================
        t.diag('Instantiation in 1st client')
        
        var test = new TestClass({
            channel : channel1,
            
            attr2   : 'attr2',
            attr3   : 'attr3'
        })
        
        
        channel1.commit()
        
        
        //======================================================================================================================================================================================================================================================
        t.diag('2nd client')
        
        channel2.on('newInstance', function (instance) {
            instanceTransfered = true
            
            t.isa_ok(instance, TestClass, "It an instance of correct class")
            
            t.ok(instance.VERO.UUID == test.VERO.UUID, "It has correct VERO object attached")
            
            t.ok(instance != test && instance.VERO != test.VERO, 'But its a copy, not the same object')
        })
        
        
        channel2.on('mutation', function (instance, packet, channel) {
            instanceMutated = true
            
            t.ok(instance.VERO.UUID == test.VERO.UUID, "Correct instance is being mutated")
            
            t.ok(instance.attr2 == 'attr2', 'Correct value for `attr2`')
            t.ok(instance.attr3 == 'attr3', 'Correct value for `attr3`')
            
            instance.setAttr3('attr3-from-channel2')
            
            instance.commit()
            
            channel2.commit()
        })
        
        
        channel1.on('mutation', function (instance, packet, channel) {
            instanceMutatedBack = true
            
            t.ok(instance === test, "Correct instance is being mutated")
            
            t.ok(instance.attr3 == 'attr3-from-channel2', 'Correct value for `attr3`')
        })
        
        
        
    }, 1000)
    
    

    
    // delay to keep the <iframe> of the test, otherwise XHR will stop working
    setTimeout(function () {
        
        t.ok(instanceTransfered, 'Instance has been transfered')
        t.ok(instanceMutated, 'Instance has been mutated')
        t.ok(instanceMutatedBack, 'Instance has been mutated back to the 1st channel')
        
        t.endAsync(async1)
        t.done()
        
    }, 5000)
})    
