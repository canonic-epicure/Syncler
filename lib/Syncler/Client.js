Role('Syncler.Client', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler'
    ],
    
    
    use     : [
        'Syncler.Replica.Client'
    ],
    
    
    methods : {
        
        newReplica : function (args) {
            args        = args || {} 
            args.scope  = this.newScope()
            
            return new Syncler.Replica.Client(args)
        }
    }
})

