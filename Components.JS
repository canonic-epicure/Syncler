COMPONENTS = {
    // a comment
    
    "Client" : [
        "=static/deps/socket.io/socket.io.js",
        "Syncler.Mutation",
        
        "Syncler.Mutation.Class.Create",
//        "Syncler.Vero.Mutation.Delete",
        "Syncler.Mutation.Class.Attribute",
        
        "Syncler.Mutation.Array.Push",
        "Syncler.Mutation.Array.Set",
        
        "Syncler.Observable",
        
        "Syncler.Object.Attribute",
        "Syncler.Object.Meta",
        
        "Syncler.Object",
        "Syncler.Topic",
        "Syncler.Topic.UUID",
        
        "Syncler.Replica",
        "Syncler.Replica.Client",
//        "Syncler.Replica.Server",
        
        "Syncler.Attribute.Base",
        "Syncler.Attribute.Object",
        "Syncler.Attribute.Array",
        
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
        
        "jsan:JooseX.Class.SimpleConstructor"
    ],
    
    
    "Test" : [
        "jsan:Task.KiokuJS.Test",
        "jsan:Task.KiokuJS.Backend.CouchDB.Core",
        "jsan:KiokuJS.Backend.Role.HTTP",
        "jsan:KiokuJS.Backend.Batch",
        
        "+Client",
        
        "Syncler.Test.TestClass",
        "Syncler.Test.Actor",
        "Syncler.Test.Fixture.Transfer"
        
//        "Syncler.Test.Fixture.NewElement",
//        "Syncler.Test.Fixture.StressLoad"
    ]
}
