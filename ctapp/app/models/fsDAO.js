'use strict';

var mongoose = require('mongoose');
var models = require('./fsmodels');

module.exports.saveAccount = function(user_id, name, type, balance, balance_date) {
    var new_account = new models.Account( {
        user_id: user_id,
        name: name,
        type: type,
        balance: balance,
        balance_date: balance_date
    });

    new_account.save(function(err,a) {
        console.log('saved account: '+JSON.stringify(a));
    });
};
