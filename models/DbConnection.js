'use strict';

var mongoose = require('mongoose');
var db;
var verbose = 2;

init();

function init() {
    if (verbose>=2) console.log('DbConnection.init()');

    console.log('process.env: '+process.env.NODE_ENV);

    var connect_string = 'mongodb://localhost/fs-dev';
    
    if (process.env.NODE_ENV=="stage") {
        connect_string = 'mongodb://localhost/fs-stage'
    }

    mongoose.connect(connect_string);
    db = mongoose.connection;

    db.on('error',console.error.bind(console,'connection error: '));
    db.once('open', function() {
        console.log('fs database connected');
    });
};

module.exports = mongoose.connection.db;