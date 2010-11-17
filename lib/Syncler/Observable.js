Role('Syncler.Observable', {
    
    does : 'JooseX.Observable',
    
    
    // XXX implement deps fetching from has : { trait : 'XXX' }
    
    has : {
        listeners               : {
            trait       : KiokuJS.Feature.Attribute.Skip,
            init        : Joose.I.Object
        },
        
        suspendCounter          : {
            trait       : KiokuJS.Feature.Attribute.Skip,
            init        : 0
        }
    }
})