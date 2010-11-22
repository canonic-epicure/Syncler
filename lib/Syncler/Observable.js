Role('Syncler.Observable', {
    
    does : 'JooseX.Observable',
    
    
    has : {
        listeners               : {
            trait       : 'KiokuJS.Feature.Attribute.Skip',
            init        : Joose.I.Object
        },
        
        suspendCounter          : {
            trait       : 'KiokuJS.Feature.Attribute.Skip',
            init        : 0
        }
    }
})