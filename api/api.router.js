'use strict';

var express = require('express');
var router = express();

var accountdao = require('../models/AccountDAO');
var catalogdao = require('../models/CatalogDAO');

router.use(function timeLog(req, res, next) {
    console.log('Time: ', Date.now());
    next();
});

router.put('/saveaccount', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    accountdao.saveAccount(req.body);

    res.send('save account');
});

router.put('/updateaccount', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    accountdao.updateAccount(req.body);

    res.send('update account');
});
router.get('/getallaccounts/:user_id', function(req,res) {
    accountdao.getAllAccounts(req.params.user_id).then( function(list) {
        res.send(list);
    });
});

router.get('/dropallaccounts', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    accountdao.dropAllAccounts();

    res.send('drop accounts');
});

router.put('/savecatalog', function(req,res) {
    console.log('  req.body='+ JSON.stringify(req.body));
    catalogdao.saveCatalog(req.body).then( function(a) {
        console.log('  api saved catalog:'+JSON.stringify(a));
        res.send('save catalog');
    });

    
});
router.get('/getallcatalogentries/:user_id', function(req,res) {
    catalogdao.getAllCatalogEntries(req.params.user_id).then( function(list) {
        res.send(list);
    });
});

module.exports = router;