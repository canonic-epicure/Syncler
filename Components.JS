COMPONENTS = {
    // a comment
    
    "Core" : [
        "Syncler.Mutation",
        
        "Syncler.Mutation.Class.Create",
//        "Syncler.Vero.Mutation.Delete",
        "Syncler.Mutation.Class.Update",
        
        "Syncler.Mutation.Array.Push",
        "Syncler.Mutation.Array.Set",
        
        "Syncler.Operation",
        "Syncler.Operation.Void",
        "Syncler.Operation.Auto",
        
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
        
        "jsan:JooseX.Class.SimpleConstructor",
        
        "jsan:KiokuJS.Backend.Role.HTTP"
    ],
    
    
    "Test" : [
        "jsan:Task.KiokuJS.Test",
        "jsan:Task.KiokuJS.Backend.CouchDB.Core",
        "jsan:KiokuJS.Backend.Batch",
        
        "+Core"
//        ,
//        "Syncler.Test.TestClass",
//        "Syncler.Test.Actor",
//        "Syncler.Test.Fixture.Basic",
//        "Syncler.Test.Fixture.Transfer",
//        "Syncler.Test.Fixture.NewElement",
//        "Syncler.Test.Fixture.StressLoad"
    ]
}
