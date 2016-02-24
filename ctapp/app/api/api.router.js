'use strict';

var express = require('express');
var router = express();
var dao = require('../models/fsDAO');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.put('/saveaccount', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    dao.saveAccount(req.body);

    res.send('save account');
});

module.exports = router;