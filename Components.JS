COMPONENTS = {
    // a comment
    
    "Core" : [
        "Syncler.Node",
        "Syncler"
    ],
    
    
    "WebPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:JooseX.SimpleRequest",
        "jsan:Task.JooseX.Namespace.Depended.Web",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "jsan:Task.JSON2.Bundle",
        
        "jsan:Task.HTTP.Request.Provider.Web"
    ],
    
    
    "NodeJSPrereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        
        "jsan:Task.JooseX.Namespace.Depended.NodeJS",
        
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "jsan:Task.JSON2.Bundle",
        
        "jsan:Task.HTTP.Request.Provider.NodeJS"
    ],
    
    
    "Test" : [
        "jsan:Task.KiokuJS.Test",
        "jsan:Task.KiokuJS.Backend.CouchDB.Core",
        "+Core"
    ]
}