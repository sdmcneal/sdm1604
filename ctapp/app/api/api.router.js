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

router.put('/updateaccount', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    dao.updateAccount(req.body);

    res.send('update account');
});

router.get('/dropallaccounts', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    dao.dropAllAccounts();

    res.send('drop accounts');
});

router.put('/savecatalog', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    dao.saveCatalog(req.body).then( function(a) {
        console.log('  api saved catalog:'+JSON.stringify(a));
        res.send('save catalog');
    });

    
});
router.get('/getallcatalogentries', function(req,res) {
    dao.getAllCatalogEntries().then( function(list) {
        res.send(list);
    });
});

module.exports = router;