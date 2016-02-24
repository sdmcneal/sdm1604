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
