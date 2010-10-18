Role('Syncler.Server', {
    
    /*VERSION,*/
    
    requires    : [ 'newScope' ],
    
    
    does    : [
        'Syncler'
    ],
    
    
    use     : [
        'Syncler.Channel.Server'
    ],
    
    
    methods : {
        
        newChannel : function () {
            return new Syncler.Channel.Server({
                fayeClient  : this.fayeClient,
                scope       : this.newScope()
            })
        }
    }
})

