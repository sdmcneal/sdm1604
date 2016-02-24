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
    dao.saveAccount(3000,"Dave","Cash",3333.0,new Date());

    res.send('save account');
});

module.exports = router;