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
                
                
                var test = new TestClass({
                    channel : handle.newChannel(),
                    
                    attr2   : 'attr2',
                    attr3   : 'attr3'
                })
                
                
                var VERO = test.VERO
                
                t.ok(VERO, 'Vero instance was attached')
                
                t.ok(VERO.history.length == 1, 'History has 1 packet')
                
                t.ok(VERO.history[0] instanceof Syncler.Vero.Mutation.Packet, 'Packet isa Syncler.Vero.Mutation.Packet')
                
                
                var packet = VERO.history[0]
                
                t.ok(packet.length() == 3, 'Packet has 3 mutations')
                
                var creation  = packet.at(0)
                
                t.ok(creation.object == test, 'Creation refer to correct object')
                
                var mutation0 = packet.at(1)
                var mutation1 = packet.at(2)
                
                t.ok(mutation0.attributeName == 'attr2' || mutation0.attributeName == 'attr3', 'Order is not guaranteed')
                t.ok(mutation1.attributeName == 'attr2' || mutation1.attributeName == 'attr3', 'Order is not guaranteed')
                
                t.ok(mutation1.object == test, 'Mutation refer to correct VERO')
            
                
                //======================================================================================================================================================================================================================================================
                t.diag('Mutation')
                
                test.setAttr1('mutate1')
                test.setAttr2('mutate2')
                
                test.commit()
                    
            
                t.ok(VERO.history.length == 2, 'History has 2 packets')
                
                var packet = VERO.history[1]
                
                t.ok(packet.length() == 2, 'Packet has 2 mutations')
                
                var mutation0 = packet.at(0)
                var mutation1 = packet.at(1)
                
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
