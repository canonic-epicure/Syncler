Role('Syncler.Operation', {
    
    trait       : 'JooseX.Class.SimpleConstructor',
    
    requires : [ 'apply', 'unapply', 'checkPrecondition', 'merge', 'run', 'commit' ],
    
    has : {
        clientID        : null,
        acceptNum       : null,
        
        mergeResultOf   : null
    }
})

