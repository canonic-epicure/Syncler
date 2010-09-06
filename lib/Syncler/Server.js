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
                
                me.onGet(ids).except(function (e) {
                    
                    res.send({
                        error : e
                    })
                    
                }).andThen(function (entries) {
                    
                    res.send({
                        result : entries
                    })
                })
            })
            
            
            app.put('/insert', function (res, res) {
                var data = req.body
                
                me.onInsert(data.entries, data.mode).except(function (e) {
                    
                    res.send({
                        error : e
                    })
                    
                }).andThen(function (ids) {
                    
                    res.send({
                        result : ids
                    })
                })
            })
            
            
            app.put('/remove', function () {
                var ids = req.body
                
                me.onRemove(ids).except(function (e) {
                    
                    res.send({
                        error : e
                    })
                    
                }).andThen(function () {
                    
                    res.send({
                        result : []
                    })
                })
            })
            
            
            app.put('/exists', function () {
                var ids = req.body
                
                me.onExists(ids).except(function (e) {
                    
                    res.send({
                        error : e
                    })
                    
                }).andThen(function (existsResults) {
                    
                    res.send({
                        result : existsResults
                    })
                })
            })
            
            
            app.put('/commit', function () {
                var data = req.body
                
                me.onCommit(data).except(function (e) {
                    
                    res.send({
                        error : e
                    })
                    
                }).andThen(function (commitRes) {
                    
                    res.send({
                        result : commitRes
                    })
                })
            })
        }
    },
    
    
    continued : {
        
        methods : {
        
            onGet : function (ids) {
                var backend = this.backend
                
                backend.get(ids).andThen(function (nodes) {
                    
                    this.CONTINUE(backend.serializeNodes(nodes))
                })
            },
            
            
            onInsert : function (entries, mode) {
                var backend = this.backend
                
                backend.insert(backend.deserializeNodes(entries), null, mode).now()
            },
            
            
            onRemove : function (ids) {
                var backend = this.backend
                
                backend.remove(ids).now()
            },
            
            
            onExists : function (ids) {
                var backend = this.backend
                
                backend.exists(ids).now()
            },
            
            
            onCommit : function () {
                this.CONTINUE()
            }
        }
    }
})






//require('Task/Joose/Core')
//require('Task/JooseX/Attribute/Bootstrap')
//require('Task/JooseX/Namespace/Depended/NodeJS')
//require('Data/UUID')
//
//
//var http    = require('http')
//var faye    = require('faye')
//var sys     = require('sys')
//var puts    = sys.puts
//var express = require('express')
//
//
//use([
//
//    'KiokuJS',
//    'KiokuJS.Backend.CouchDB',
//    
//    'Syncler'
//
//], function () {
//    
//    puts('Syncler server started')
//    
//    
//    var bayeux = new faye.NodeAdapter({
//        mount       : '/faye',
//        timeout     : 45
//    })
//    
//    
//    var client = bayeux.getClient()
//    
//    
//    var backend = new KiokuJS.Backend.CouchDB({
//        host    : 'localhost',
//        port    : 80,
//        prefix  : '5984',
//        
//        dbName  : 'shareboard'
//    })
//    
//    var handler = KiokuJS.connect({
//        backend : backend
//    })
//    
//    
//    
//    
//    app.get('/board/publish', function (req, res) {
//        
//        var entries = req.body
//        
//        KiokuJS.store(entries).andThen(function () {
//            
//            var board       = KiokuJS.expand(entries)            
//            var boardID     = board.uuid
//            
//            
//            client.subscribe('/board/' + boardID + '/update', function (message) {
//                
//            })
//            
//            client.subscribe('/board/' + boardID + '/tool', function (message) {
//            
//            })
//        })
//        
//        res.send({ result : 'ok' })
//    })
//    
//
//    app.get('/board/fetch', function (req, res) {
//        
//        var id = req.param('id')
//        
//        KiokuJS.fetch(id).andThen(function (board, entries) {
//            
//            var board       = KiokuJS.expand(entries)            
//            var boardID     = board.uuid
//            
//            
//            client.subscribe('/board/' + boardID + '/update', function (message) {
//                
//            })
//            
//            client.subscribe('/board/' + boardID + '/tool', function (message) {
//            
//            })
//        })
//        
//        res.send({ result : entries })
//    })
//    
//    app.get('/asd', function(req, res){
//        
//        res.send('hello asd world')
//    })
//    
//    
//    bayeux.attach(app)
//    
//    app.listen(8080)    
//})
//

