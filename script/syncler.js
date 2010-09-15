require.paths.unshift('./lib')


var http    = require('http')
var faye    = faye = require('faye')
var sys     = require('sys')
var puts    = sys.puts
var express = require('express')

var argv            = require('optimist').argv
var argvArr         = argv._



var backendClass    = argv.backend || 'KiokuJS.Backend.CouchDB'
var backendParams   = argv.backendParams || '{}'

var fayeURL         = argv.fayeURL || '/faye'
var baseURL         = argv.baseURL || '/syncler'

var port            = Number(argv.port) || 8080


require('Task/Syncler/Prereq')
require('Task/KiokuJS/Core')
require('Task/Syncler/Core')

use([

    'KiokuJS', // XXX need to include 'KiokuJS' for Joose.O.each override (move to Data.Visitor?)
    
    'Syncler.Server',
    backendClass

], function () {
    
    var app = express.createServer()
    
    app.configure(function () {
        app.use( express.bodyDecoder() )
    })
    
    
    var bayeux = new faye.NodeAdapter({
        mount       : fayeURL,
        timeout     : 45
    })
    
    
    
    var params = eval('(' + backendParams + ')')
    
    var server = new Syncler.Server({
        backendClass        : eval('(' + backendClass + ')'),
        
        backendParams       : params,
        
        baseURL             : baseURL.replace(/\/$/, ''),
        port                : port,
        
        fayeClient          : bayeux.getClient(),
        
        app                 : app
    })

    
    bayeux.attach(app)
    
    app.listen(port)
    
    
    puts('Syncler server started')
})


process.on('uncaughtException', function (err) {
    console.log('exception: ' + err)
})
