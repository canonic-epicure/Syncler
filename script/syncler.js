require('Task/Joose/Core')
require('Task/JooseX/Attribute/Bootstrap')
require('Task/JooseX/Namespace/Depended/NodeJS')
require('Data/UUID')


var http    = require('http')
var faye    = require('faye')
var sys     = require('sys')
var puts    = sys.puts
var express = require('express')


use([

    'KiokuJS',
    'KiokuJS.Backend.CouchDB',
    
    'Syncler.Server'

], function () {
    
    puts('Syncler server started')
    
    
    var app = express.createServer()
    
    app.configure(function(){
        app.use(express.bodyDecoder())
    })
    
    
    
    var server = new Syncler.Server({
        backendClass        : KiokuJS.Backend.CouchDB,
        
        backendParams       : {
            dbName      : 'http://local/5984/test'
        },
        
        app                 : app
    })
    
    
    app.listen(8080)    
})


