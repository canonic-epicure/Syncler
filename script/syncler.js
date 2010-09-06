require.paths.unshift('./lib')

require('Task/Joose/Core')
require('Task/JooseX/Attribute/Bootstrap')
require('Task/JooseX/Namespace/Depended/NodeJS')
require('Task/JooseX/CPS/All')
require('Data/UUID')


var http    = require('http')
var faye    = require('faye')
var sys     = require('sys')
var puts    = sys.puts
var express = require('express')


use([

    'KiokuJS', // XXX need to include 'KiokuJS' for Joose.O.each override (move to Data.Visitor?)

    'Syncler.Server',
    'KiokuJS.Backend.CouchDB'

], function () {
    
    puts('Syncler server started')
    
    
    var app = express.createServer()
    
    app.configure(function(){
        app.use(express.bodyDecoder())
    })
    
    
    
    var server = new Syncler.Server({
        backendClass        : KiokuJS.Backend.CouchDB,
        
        backendParams       : {
        },
        
        app                 : app
    })
    
    
    app.listen(8080)    
})


