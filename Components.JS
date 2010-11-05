COMPONENTS = {
    // a comment
    
    "Core" : [
        "Syncler.Vero.Mutation",
        
        "Syncler.Vero.Mutation.Create",
        "Syncler.Vero.Mutation.Delete",
        "Syncler.Vero.Mutation.Update",
        
        "Syncler.Vero",
        
        "Syncler.Vero.Role",
        "Syncler.Vero.Role.Topic",
        
        "Syncler.Vero.Attribute",
        "Syncler.Vero.Meta",
        
        "Syncler.Channel",
        "Syncler.Channel.Client",
        "Syncler.Channel.Server",
        
        "Syncler.PubSub.Faye",
        
        "Syncler",
        "Syncler.Client"
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
        
        "jsan:KiokuJS.Backend.Role.HTTP"
    ],
    
    
    "Test" : [
        "=static/deps/faye/faye-browser.js",
        "jsan:Task.KiokuJS.Test",
        "jsan:Task.KiokuJS.Backend.CouchDB.Core",
        "jsan:KiokuJS.Backend.Batch",
        
        "+Core",
        
        "Syncler.Test.TestClass",
        "Syncler.Test.Actor",
        "Syncler.Test.Fixture.Basic",
        "Syncler.Test.Fixture.Transfer",
        "Syncler.Test.Fixture.NewElement"
    ]
}
