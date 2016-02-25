'use strict';

var mongoose = require('mongoose');
var models = require('./fsmodels');

module.exports.saveAccount = function(data) {
    var new_account = new models.Account( {
        user_id: data.user_id,
        account_id: data.account_id,
        name: data.name,
        type: data.type,
        balance: data.balance,
        balance_date: data.balance_date
    });

    new_account.save(function(err,a) {
        console.log('saved account: '+JSON.stringify(a));
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
}
