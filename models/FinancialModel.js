'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FinancialModel = new Schema( {
    model_id: Number,
    user_id: Number,
    model_name: String,
    create_date: Date,
    active_flag: Boolean
});

module.exports = mongoose.model('FinancialModel',FinancialModel);