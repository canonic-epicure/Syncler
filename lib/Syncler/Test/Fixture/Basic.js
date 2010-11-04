Class('Syncler.Test.Fixture.Basic', {
    
    isa     : 'KiokuJS.Test.Fixture',
    
    
    has : {
        sort                    : 10
    },

    
    continued : {
        
        methods : {
            
            populate : function (handle, t) {
                //======================================================================================================================================================================================================================================================
                t.diag('Syncler.Test.Fixture.Basic - Sanity')
                
                t.ok(Syncler.Vero.Meta, "Syncler.Vero.Meta is here")
            
                
                //======================================================================================================================================================================================================================================================
                t.diag('Class declaration')
                
                
                Class('TestClass', {
                    
                    trait   : Syncler.Vero.Meta,
                    
                    sync    : {
                        attr1 : 'attr1',
                        attr2 : null,
                        attr3 : null
                    }
                    
                })
                
                t.ok(TestClass, 'TestClass is here')
                
                
                //======================================================================================================================================================================================================================================================
                t.diag('Instantiation')
                
                var channel     = handle.newChannel()
                
                var test = new TestClass({
                    channel : channel,
                    
                    attr2   : 'attr2',
                    attr3   : 'attr3'
                })
                
                
                var VERO = test.VERO
                
                t.ok(VERO, 'Vero instance was attached')
                
                t.ok(channel.internalQueue.length == 3, 'History has 3 packets')
                
                var creation  = channel.internalQueue[0]
                
                t.ok(creation.object == test, 'Creation refer to correct object')
                
                var mutation0 = channel.internalQueue[1]
                var mutation1 = channel.internalQueue[2]
                
                t.ok(mutation0.attributeName == 'attr2' || mutation0.attributeName == 'attr3', 'Order is not guaranteed')
                t.ok(mutation1.attributeName == 'attr2' || mutation1.attributeName == 'attr3', 'Order is not guaranteed')
                
                t.ok(mutation1.object == test, 'Mutation refer to correct VERO')
            
                
                //======================================================================================================================================================================================================================================================
                t.diag('Mutation')
                
                test.setAttr1('mutate1')
                test.setAttr2('mutate2')
                
                t.ok(channel.internalQueue.length == 5, 'History now has 5 packets')
                
                var mutation0 = channel.internalQueue[3]
                var mutation1 = channel.internalQueue[4]
                
                t.ok(mutation0.object == test, 'Correct object for mutation 0')
                t.ok(mutation0.attributeName == 'attr1', 'Correct attribute name for mutation 0')
                t.ok(mutation0.oldValue == 'attr1', 'Correct old value for mutation 0')
                t.ok(mutation0.newValue == 'mutate1', 'Correct new value for mutation 0')
                
                t.ok(mutation1.object == test, 'Correct object for mutation 1')
                t.ok(mutation1.attributeName == 'attr2', 'Correct attribute name for mutation 1')
                t.ok(mutation1.oldValue == 'attr2', 'Correct old value for mutation 1')
                t.ok(mutation1.newValue == 'mutate2', 'Correct new value for mutation 1')
                
                
                this.CONTINUE()
            },
            // eof populate
            
            
            verify : function (handle, t) {
                this.CONTINUE()
            }
            // eof verify
        }
    }

})
