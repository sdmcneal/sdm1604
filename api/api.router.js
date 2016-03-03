'use strict';

var express = require('express');
var router = express();

var accountdao = require('../models/AccountDAO');
var catalogdao = require('../models/CatalogDAO');
var modeldao = require('../models/FinancialModelDAO');

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

// Financial Model
router.get('/getfinancialmodel/:user_id/:model_id', function (req,res) {
    modeldao.getFinancialModel({user_id: req.params.user_id, model_id: req.params.model_id})
        .then(function(model) {
            res.send(model);
        })
        .fail(function(err) {
            res.status(500).send('error: '+err);
        });
});
router.get('/getallfinancialmodels/:user_id', function (req,res) {
    modeldao.getAllFinancialModels({user_id: req.params.user_id})
        .then(function(list) {
            res.send(list);
        })
        .fail(function(err) {
            res.status(500).send('error: '+err);
        });
});
router.put('/savefinancialmodel',function(req,res) {
    modeldao.saveFinancialModel(req.body)
        .then(function(doc) {
            res.send(doc);
        })
        .fail(function(err) {
            res.status(500).send('error:'+err);
        });
});
router.put('/updatefinancialmodel',function(req,res) {
    modeldao.updateFinancialModel(req.body)
        .then(function(doc) {
            res.send(doc);
        })
        .fail(function(err) {
            res.status(500).send('error:'+err);
        });
});
router.get('/dropfinancialmodels/:user_id',function(req,res) {
    modeldao.dropFinancialModels({user_id: req.params.user_id})
        .then(function(doc) {
            res.send(doc);
        })
        .fail(function(err) {
            res.status(500).send('error:'+err);
        });
});
router.get('/removefinancialmodel/:user_id/:model_id',function(req,res) {
    modeldao.removeFinancialModel({user_id: req.params.user_id, model_id: req.params.model_id})
        .then(function(doc) {
            res.send(doc);
        })
        .fail(function(err) {
            res.status(500).send('error:'+err);
        });
});

module.exports = router;