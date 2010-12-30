Role('Syncler.Observable', {
    
    use : [ 
        'JooseX.Observable.Channel'    
    ],
    
    does : 'JooseX.Observable',
    
    
    has : {
        rootChannel     : {
            trait       : 'KiokuJS.Feature.Attribute.Skip',
            
            is          : 'rw',
            lazy        : function () { 
                return new JooseX.Observable.Channel() 
            }
        },
        
        suspendCounter          : {
            trait       : 'KiokuJS.Feature.Attribute.Skip',
            init        : 0
        }
    }
})