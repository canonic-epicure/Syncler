require.paths.unshift('./lib')

require('Task/Joose/Core')
require('Task/JooseX/Attribute/Bootstrap')
require('Task/JooseX/Namespace/Depended/NodeJS')
require('Task/JooseX/CPS/All')


var http    = require('http')
var sys     = require('sys')
var puts    = sys.puts
var express = require('express')

var spawn   = require('child_process').spawn


use([

    'KiokuJS.Backend.CouchDB'

], function () {
    
    var app = express.createServer()
    
    app.configure(function(){
        app.use(express.bodyDecoder())
    })
    
    var tests   = {}
    
    app.put('/start_test', function (req, res) {
        var dbURL   = req.body.dbURL
        var port    = req.body.port
        
        var backend = new KiokuJS.Backend.CouchDB({
            dbURL : dbURL
        })
        
        backend.createDB().andThen(function () {
            
            puts('node script/syncler.js --port=' + port + ' --backend=KiokuJS.Backend.CouchDB --backendParams="{dbURL : \'' + dbURL + '\'}"')
            
            var child = tests[ dbURL ] = spawn('node', [ 
                'script/syncler.js', 
                '--baseURL=/',
                '--port=' + port,
                '--backend=KiokuJS.Backend.CouchDB',
                '--backendParams={dbURL : \'' + dbURL + '\'}'
            ])
                
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
    })
    
    
    app.put('/finish_test', function (req, res) {
        var dbURL = req.body.dbURL
        
        tests[ dbURL ].kill('SIGKILL')
        
        var backend = new KiokuJS.Backend.CouchDB({
            dbURL : dbURL
        })
        
        backend.deleteDB().andThen(function () {
            res.send({
                result : 'ok'
            })
        })
    })
    
    
    
    app.listen(8080)
    
    puts('Test starter started')
})
