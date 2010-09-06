Class('Syncler', {
    
    /*VERSION,*/
    
    isa         : 'KiokuJS.Backend',
    
    
    use     : [
        'JSON2',
    
        Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR',
        
        'Syncler.Node',
        
        'KiokuJS.Exception.Format',
        'KiokuJS.Exception.Network',
        'KiokuJS.Exception.LookUp',
        'KiokuJS.Exception.Overwrite', 
        'KiokuJS.Exception.Update',
        'KiokuJS.Exception.Conflict'
    ],
    
    does    : [
        'JooseX.Observable'
//        'KiokuJS.Backend.Feature.Overwrite', 
//        'KiokuJS.Backend.Feature.Update' 
    ],
    
    
    
    has : {
        baseURL                 : '/syncler',
        
        nodeClass               : Joose.I.FutureClass('Syncler.Node'),
        
        requestProviderClass    : Joose.I.FutureClass(Joose.is_NodeJS ? 'HTTP.Request.Provider.NodeJS' : 'HTTP.Request.Provider.XHR')
    },
    
    
    
    after : {
        
        initialize : function () {
            this.baseURL = this.baseURL.replace(/\/+$/, '')
        }
    },
    
    
        
    methods : {
        
        
        getRequest : function (config) {
            return new this.requestProviderClass(config)
        },
        
        
        getURLforCouch : function () {
            return 'http://' + this.host + ':' + this.port + '/' + this.prefix 
        },
        
        
        getURLforDB : function () {
            return this.getURLforCouch() + '/' + this.dbName
        },
        
        
        evalJSON : function (str) {
            try {
                return JSON2.parse(str)
            } catch (e) {
                throw new KiokuJS.Exception.Format({ message : 'Invalid JSON: ' + str })
            }
        }
    },
    
    
    continued : {
        
        methods : {
        
            commit      : function () {
                
            },
            
            
            rollback    : function () {
            }
        }
    }
})