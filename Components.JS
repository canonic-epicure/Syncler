COMPONENTS = {
    // a comment
    
    "Core" : [
        "Syncler.Vero.Mutation",
        
        "Syncler.Vero.Mutation.Create",
        "Syncler.Vero.Mutation.Delete",
        "Syncler.Vero.Mutation.Update",
        
        "Syncler.Vero.Mutation.Packet",
        
        "Syncler.Vero",
        
        "Syncler.Vero.Role",
        "Syncler.Vero.Role.Topic",
        
        "Syncler.Vero.Attribute",
        "Syncler.Vero.Meta",
        
        
        "Syncler.Node",
        "Syncler.Channel",
        
        "Syncler"
    ],
    
    
    "Prereq" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        "jsan:Task.JooseX.Namespace.Depended.Auto",
        "jsan:Task.JooseX.CPS.All",
        "jsan:Task.HTTP.Request.Provider.Auto",
        
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "jsan:Task.JSON2.Bundle",
        "jsan:Task.JooseX.Observable.Core",
        
        "=static/deps/faye/faye-browser.js"
    ],
    
    
    "Test" : [
        "jsan:Task.KiokuJS.Test",
        "jsan:Task.KiokuJS.Backend.CouchDB.Core",
        
        "+Core",
        
        "Syncler.Test.Fixture.Basic",
        "Syncler.Test.Fixture.Transfer"
    ]
}
