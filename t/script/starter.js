require.paths.unshift('./lib')

require('Task/Joose/NodeJS')


var http    = require('http')
var sys     = require('sys')
var puts    = sys.puts
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
    
    Joose.O.each(params, function (value, name) {
        
        paramsAsArr.push('--' + name + '=' + JSON.stringify(value))
    })
    
    var child = tests[ port ] = spawn('node', [ 'script/syncler_server.js' ].concat(paramsAsArr))
        
    
    var initialOutput = true
    
    child.stdout.on('data', function (data) {
        
        puts('STDOUT data for port [' + port + ']: ' + data)
        
        if (initialOutput) {
            initialOutput = false
            
            res.send({
                result : 'ok'
            })
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
