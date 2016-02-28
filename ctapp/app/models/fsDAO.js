'use strict';

var mongoose = require('mongoose');
var models = require('./fsmodels');
var verbose = 3;

mongoose.connect('mongodb://localhost/fs');

var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error: '));
db.once('open', function() {
    console.log('database connected.');
});

module.exports.saveAccount = function(data) {
    var new_account = new models.Account( {
        user_id: data.user_id,
        account_id: data.account_id,
        name: data.name,
        type: data.type,
        balance: data.balance,
        balance_date: data.balance_date
    });

    new_account.save().then(function(a) {
        console.log('  saved account: '+JSON.stringify(a));
        return a;
    });
    //new_account.save(function(err,a) {
    //    console.log('saved account: '+JSON.stringify(a));
    //});
};
module.exports.updateAccount = function(data) {
    if (verbose>=2) console.log('fsDAO.updateAccount()');

    models.Account.findOne({account_id: data.account_id}, function(err,doc) {
        doc.name = data.name;
        doc.type = data.type;
        doc.balance = data.balance;
        doc.balance_date = data.balance_date;
        doc.save(function (err,a) {
            if (verbose>=3) console.log('updated account: ' + JSON.stringify(a));
        });
    });
};
module.exports.dropAllAccounts = function() {
    if (verbose>=2) console.log('fsDAO.dropAllAccounts()');

    mongoose.connection.db.dropCollection('accounts',function(err,result) {
        console.log('  collection dropped with result: '+JSON.stringify(result));
    });
};

module.exports.saveCatalog = function(data) {
    var new_catalog = new models.Catalog( {
        catalog_entry_id: data.catalog_entry_id,
        parent_catalog_entry_id: data.parent_catalog_entry_id,
        account_id: data.account_id,
        paired_account_id: data.paired_account_id,
        description: data.description,
        frequency: data.frequency,
        frequency_param: data.frequency_param,
        amount: data.amount,
        amount_calc: data.amount_calc,
        param1: data.param1,
        param2: data.param2,
        tax_year_maximum: data.tax_year_maximum,
        start_date: data.start_date,
        end_date: data.end_date
    });
    
    new_catalog.save(function(err,a) {
        console.log('saved catalog entry: '+JSON.stringify(a));
    });
};
