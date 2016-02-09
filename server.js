//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var async = require('async');
var express = require('express');
var verbose = true;
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);

router.use(express.bodyParser());
router.get('/api/gettrack/:id', function(req,res) {
  var _id = req.params.id;
  
  res.send('/api/gettrack/id:'+_id);
});
router.post('/api/recordtrack', function(req,res) {
  // tested with curl -d '{"key":"value"}' -H "Content-Type: application/json" http://127.0.0.1:8080/api/recordtrack
  if (verbose) console.log('received /api/recordtrack: '+JSON.stringify(req.body));
  res.send('submission received');
})
router.use(express.static(path.resolve(__dirname, 'ctapp')));

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
