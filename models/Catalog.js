'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CatalogSchema = new Schema( {
    user_id: Number,
    catalog_entry_id: Number,
    parent_catalog_entry_id: Number,
    catalog_entry_type: String,
    account_object_id: String,
    paired_account_object_id: String,
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

module.exports = mongoose.model('Catalog',CatalogSchema);