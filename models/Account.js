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

module.exports = mongoose.model('Account',AccountSchema);