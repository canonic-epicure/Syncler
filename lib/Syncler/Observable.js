Role('Syncler.Observable', {
    
    does : 'JooseX.Observable',
    
    
    has : {
        listeners               : {
            trait       : 'KiokuJS.Feature.Attruibute.Skip',
            init        : Joose.I.Object
        },
        
        suspendCounter          : {
            trait       : 'KiokuJS.Feature.Attruibute.Skip',
            init        : 0
        }
    }
})