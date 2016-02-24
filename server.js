//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');
var apirouter = require('./ctapp/app/api/api.router');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dao = require('./ctapp/app/models/fsDAO');
var Schema = mongoose.Schema;

var verbose = true;
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
mongoose.connect('mongodb://localhost/fs');

var sandboxSchema = new Schema({
  user_id: Number,
  name: String,
  config: String
});

var Sandbox = mongoose.model('Sandbox',sandboxSchema);

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error: '));
db.once('open', function() {
  console.log('database connected.');


  //var next_sandbox = new Sandbox( {user_id: 2000, name: "Fred", config: "something else"});
  //next_sandbox.save(function(err,f) {
  //  console.log('saved '+JSON.stringify(f));
  //});

});

router.use(express.bodyParser());

//router.post('/api/recordtrack', function(req,res) {
//  // tested with curl -d '{"key":"value"}' -H "Content-Type: application/json" http://127.0.0.1:8080/api/recordtrack
//  if (verbose) console.log('received /api/recordtrack: '+JSON.stringify(req.body));
//  res.send('submission received');
//})
router.use('/api',apirouter);

router.use(express.static(path.resolve(__dirname, 'ctapp')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
