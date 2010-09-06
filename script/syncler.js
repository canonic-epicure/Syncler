require.paths.unshift('./lib')

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

//    'ShareBoard.Model.Board',
    'KiokuJS',
    'KiokuJS.Backend.CouchDB'

], function () {
    
    puts('ShareBoard server started')
    
    
    var bayeux = new faye.NodeAdapter({
        mount       : '/faye',
        timeout     : 45
    })
    
    
    var client = bayeux.getClient()
    
    
    var backend = new KiokuJS.Backend.CouchDB({
        host    : 'localhost',
        port    : 80,
        prefix  : '5984',
        
        dbName  : 'shareboard'
    })
    
    var handler = KiokuJS.connect({
        backend : backend
    })
    
    
    var app = express.createServer()
    
    app.configure(function(){
        
        app.use(express.bodyDecoder())
    })
    
    
    app.get('/board/publish', function (req, res) {
        
        var entries = req.body
        
        KiokuJS.store(entries).andThen(function () {
            
            var board       = KiokuJS.expand(entries)            
            var boardID     = board.uuid
            
            
            client.subscribe('/board/' + boardID + '/update', function (message) {
                
            })
            
            client.subscribe('/board/' + boardID + '/tool', function (message) {
            
            })
        })
        
        res.send({ result : 'ok' })
    })
    

    app.get('/board/fetch', function (req, res) {
        
        var id = req.param('id')
        
        KiokuJS.fetch(id).andThen(function (board, entries) {
            
            var board       = KiokuJS.expand(entries)            
            var boardID     = board.uuid
            
            
            client.subscribe('/board/' + boardID + '/update', function (message) {
                
            })
            
            client.subscribe('/board/' + boardID + '/tool', function (message) {
            
            })
        })
        
        res.send({ result : entries })
    })
    
    app.get('/asd', function(req, res){
        
        res.send('hello asd world')
    })
    
    
    bayeux.attach(app)
    
    app.listen(8080)    
})


