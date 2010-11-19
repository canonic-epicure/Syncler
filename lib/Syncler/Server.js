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
            return new Syncler.Replica.Server({
                fayeClient  : this.fayeClient,
                scope       : this.newScope()
            })
        }
    }
})

