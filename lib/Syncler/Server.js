Class('Syncler.Server', {
    
    does        : 'JooseX.Observable',
    
    use     : [
    ],
    
    
    has : {
        backendClass            : null,
        backendParams           : null,
        
        backend                 : null,
        
        app                     : { required : true }
    },
    

    methods : {
        
        initialize : function () {
            this.backend = new this.backendClass(this.backendParams)
            
            var app = this.app
            
            var me          = this
            
            app.put('/get', function (req, res) {
                var ids = req.body
                
                
            })
            
            
            app.put('/insert', function () {
            
            })
            
            
            app.put('/remove', function () {
            
            })
            
            
            app.put('/exists', function () {
            
            })
            
            
            app.put('/commit', function () {
            
            })
        }
    },
    
    
    continued : {
        
        methods : {
        
            onGet : function () {
            }
        }
    }
})






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
    
    'Syncler'

], function () {
    
    puts('Syncler server started')
    
    
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


