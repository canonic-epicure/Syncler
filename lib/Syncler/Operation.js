Role('Syncler.Operation', {
    
    trait       : 'JooseX.Class.SimpleConstructor',
    
    requires : [ 'apply', 'unapply', 'checkPrecondition', 'merge', 'run' ],
    
    has : {
        replicaID       : null,
        acceptNum       : null,
        
        mergeResultOf   : null
    }
})

