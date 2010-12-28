require.paths.unshift('./lib')


var http    = require('http')
var sys     = require('sys')
var puts    = sys.puts
var express = require('express')
faye        = require('faye') // make it global to skip loading as a dependency of Syncler

var argv            = require('optimist').argv

var backendClass    = argv.backendClass     && JSON.parse(argv.backendClass)     || 'KiokuJS.Backend.Hash'
var backendParams   = argv.backendParams    && JSON.parse(argv.backendParams)    || {}
var baseURL         = argv.baseURL          && JSON.parse(argv.baseURL)          || '/'
var socketRes       = argv.socketRes        && JSON.parse(argv.socketRes)        || 'socket.io'

var preload         = argv.preload                                               || []


var port            = Number(argv.port)                                          || 8080
var deepPrefetch    = argv.deepPrefetch                                          || false


require('Task/Joose/NodeJS')

use([

    'Syncler.ServerApp',
    backendClass

].concat(preload), function () {
    
    var app = express.createServer()
    
    app.configure(function () {
        app.use( express.bodyDecoder() )
    })
    
    
    puts('Starting Syncler.ServerApp')
    
    var server = new Syncler.ServerApp({
        backendClass        : eval('(' + backendClass + ')'),
        
        backendParams       : backendParams,
        
        socketRes           : socketRes.replace(/\/$/, ''),
        baseURL             : baseURL.replace(/\/$/, ''),
        
        port                : port,
        
        app                 : app,
        
        deepPrefetch        : deepPrefetch,
        
        socketListener      : require('socket.io').listen(app, { resource : socketRes })
    })

    
    app.listen(port)
    
    puts('Syncler.ServerApp server started')
    puts('Backend class: : [' + backendClass + ']')
    puts('Backend configuration parameters: ' + JSON.stringify(backendParams))
    puts('BaseURL: [' + baseURL + ']')
    puts('SocketURL: [' + socketRes + ']')
    puts('Port: [' + port + ']')
})


process.on('uncaughtException', function (err) {
    console.log('exception: ' + err)
    console.log('stack: ' + err.stack)
})
