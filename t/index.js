var Harness
var isNode        = typeof process != 'undefined' && process.pid

if (isNode) {
    require('Task/Test/Run/NodeJSBundle')
    
    Harness = Test.Run.Harness.NodeJS
} else 
    Harness = Test.Run.Harness.Browser.ExtJS
        
    
var INC = (isNode ? require.paths : []).concat('../lib', '/jsan')


Harness.configure({
    title       : 'Syncler Test Suite',
    
    runCore     : 'sequential',
    keepResults : true,
    
    preload : [
        "Task.Syncler.Prereq",
        {
            text : "use.paths = " + Harness.prepareINC(INC)
        },
        "Task.Syncler.Test"
    ]
})


Harness.start(
    '010_sanity.t.js',
    '011_replica.t.js'
    
//    '020_fixtures_kioku.t.js',
//    '030_fixture_basic.t.js'
//    ,
//    '040_fixture_transfer.t.js',
//    '050_fixture_new_element.t.js',
//    '060_fixture_stressload.t.js'
)
