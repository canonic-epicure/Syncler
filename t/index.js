var Harness
var isNode        = typeof process != 'undefined' && process.pid

if (isNode) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
var INC = (isNode ? require.paths : []).concat('../lib', '/jsan')


Harness.configure({
    title     : 'Syncler Test Suite',
    
    preload : Joose.is_NodeJS ? [
        "Task.Syncler.NodeJSPrereq",
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + JSON.stringify(INC)
        },
        "Task.Syncler.Test"
        
    ] : [
        "Task.Syncler.WebPrereq",
        {
            text : "JooseX.Namespace.Depended.Manager.my.INC = " + Ext.encode(Harness.absolutizeINC(INC))
        },
        "Task.Syncler.Test"
    ]
})


Harness.start(
    '010_sanity.t.js',
    '020_fixtures.t.js'
)
