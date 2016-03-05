'use strict';

var db = require('./DbConnection');
var Account = require('./Account');
var q = require('q');
var verbose = 1;


module.exports.saveAccount = function (data) {
    var defer = q.defer();

    var new_account = new Account({
        user_id: data.user_id,
        account_id: data.account_id,
        name: data.name,
        type: data.type,
        balance: data.balance,
        balance_date: data.balance_date
    });

    new_account.save(function(err,result) {
        if (err) {
            defer.reject(err);
        } else {
            if (verbose>=3) console.log('  saved account: ' + JSON.stringify(result));
            defer.resolve(result);
        }
    });

    return defer.promise;
};
module.exports.updateAccount = function (data) {
    if (verbose >= 2) console.log('fsDAO.updateAccount()');
    var defer = q.defer();

    Account.findOne({account_id: data.account_id}, function (err, doc) {
        doc.name = data.name;
        doc.type = data.type;
        doc.balance = data.balance;
        doc.balance_date = data.balance_date;
        doc.save(function (err, a) {
            if (err) {
                defer.reject(err);
            } else {
                if (verbose >= 3) console.log('updated account: ' + JSON.stringify(a));
                defer.resolve(a);
            }
        });
    });
    return defer.promise;
};
module.exports.dropAllAccounts = function () {
    if (verbose >= 2) console.log('fsDAO.dropAllAccounts()');
    var defer = q.defer();

    db.dropCollection('accounts',function(err,data) {
        if (err) {
            defer.reject(err);
        } else {
            var msg = '  collection dropped with result: ' + JSON.stringify(data);
            console.log(msg);
            defer.resolve(msg);
        }
    });

    return defer.promise;
};
module.exports.getAllAccounts = function(user_id) {
    if (verbose>=2) console.log('AccountDAO.getAllAccounts()');
    var defer = q.defer();

    Account.find({user_id: user_id},function (err, docs) {
        if (err) {
            defer.reject(err);
        } else {
            if (verbose>=3) console.log('  docs returned: '+JSON.stringify(docs));
            defer.resolve(docs);
        }
    });

    return defer.promise;
}