'use strict';

var mongoose = require('mongoose');
var db;
var verbose = 2;

init();

function init() {
    if (verbose>=2) console.log('DbConnection.init()');

    mongoose.connect('mongodb://localhost/fs');
    db = mongoose.connection;

    db.on('error',console.error.bind(console,'connection error: '));
    db.once('open', function() {
        console.log('fs database connected');
    });
};

module.exports = mongoose.connection.db;