require.paths.unshift('./lib')

require('Task/Joose/NodeJS')


var http    = require('http')
var util = require('util')
var puts    = util.puts
var express = require('express')

var spawn   = require('child_process').spawn


var app = express.createServer()

app.configure(function(){
    app.use(express.bodyDecoder())
})

var tests   = {}

app.put('/start_test', function (req, res) {
    var params      = req.body
    
    puts('Starting `syncler_server` instance with arguments: [' + JSON.stringify(params) + ']')
    
    var port        = params.port
    
    var paramsAsArr = []
    
    var debugging   = params.debugging
    delete params.debugging
    
    
    Joose.O.each(params, function (value, name) {
        
        paramsAsArr.push('--' + name + '=' + JSON.stringify(value))
    })
    
    paramsAsArr.push('--preload=Syncler.Test.TestClass')
    
    var child = tests[ port ] = spawn('node', [].concat(debugging ? '--debug' : [], 'script/syncler_server.js', paramsAsArr))
        
    
    var initialOutput = true
    
    child.stdout.on('data', function (data) {
        
        puts('STDOUT data for port [' + port + ']: ' + data)
        
        if (initialOutput) {
            initialOutput = false
            
            // give some time for the ServerApp to start and load the dependencies
            setTimeout(function () {
                
                res.send({
                    result : 'ok'
                })
            }, 500)
        }
    })
    
    child.stderr.on('data', function (data) {
        puts('STDERR data for port [' + port + ']: ' + data)
    })
})


app.put('/finish_test', function (req, res) {
    var port = req.body.port
    
    tests[ port ].kill('SIGKILL')
    
    res.send({
        result : 'ok'
    })
})


app.listen(8080)

puts('Test starter started on port 8080')
