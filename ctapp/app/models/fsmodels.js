'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema( {
    user_id: Number,
    account_id: Number,
    name: String,
    type: String,
    balance: Number,
    balance_date: Date
});

module.exports.Account = mongoose.model('Account',AccountSchema);

var CatalogSchema = new Schema( {
    catalog_entry_id: Number,
    parent_catalog_entry_id: Number,
    account_id: Number,
    paired_account_id: Number,
    description: String,
    frequency: String,
    frequency_param: Number,
    amount: Number,
    amount_calc: Number,
    param1: String,
    param2: String,
    tax_year_maximum: Number,
    start_date: Date,
    end_date: Date
});

module.exports.Catalog = mongoose.model('Catalog',CatalogSchema);

