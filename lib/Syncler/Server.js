Role('Syncler.Server', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler'
    ],
    
    
    use     : [
        'Syncler.Replica.Server'
    ],
    
    
    methods : {
        
        newReplica : function () {
            args.scope  = this.newScope()
            
            return new Syncler.Replica.Server(args)
        }
    }
})

