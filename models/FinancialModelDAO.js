'use strict';

var db = require('./DbConnection');
var FinancialModel = require('./FinancialModel');
var q = require('q');
var verbose = 3;

module.exports.saveFinancialModel = function(data) {
    if (verbose>=2) console.log('FinancialModelDAO.saveFinancialModel()');

    var defer = q.defer();

    var new_model = new FinancialModel( {
        model_id: data.model_id,
        user_id: data.user_id,
        model_name: data.model_name,
        create_date: new Date(),
        active_flag: true
    });

    new_model.save( function (err, a) {
        if (verbose >= 3) console.log('  saved model: ' + JSON.stringify(a));
        if (err) {
            defer.reject(err);
        } else {

        defer.resolve(a);
        }
    });

    return defer.promise;
};
module.exports.updateFinancialModel = function(data) {
    if (verbose>=2) console.log('FinancialModelDAO.updateFinancialModel()');
    var defer = q.defer();

    FinancialModel.findOne({user_id: data.user_id, model_id: data.model_id}, function (err, doc) {
        if (err) {
            defer.reject(err);
        } else {
            doc.model_name= data.model_name;
            doc.active_flag= data.active_flag;
            doc.save(function(err,a) {
                if (err) {
                    defer.reject(err);
                } else {
                    defer.resolve(a);
                }
            });
        }
    });
    return defer.promise;
};
module.exports.getFinancialModel = function(data) {
    if (verbose>=2) console.log('FinancialModelDAO.updateFinancialModel()');
    var defer = q.defer();

    FinancialModel.findOne({user_id: data.user_id, model_id: data.model_id}, function (err, doc) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(doc);
        }
    });
    return defer.promise;
};
module.exports.removeFinancialModel = function(data) {
    if (verbose>=2) console.log('FinancialModelDAO.removeFinancialModel()');
    var defer = q.defer();

    FinancialModel.remove({user_id: data.user_id, model_id: data.model_id}, function(err,a) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(a);
        }
    });

    return defer.promise;
};
module.exports.getAllFinancialModels = function(user_id) {
    if (verbose>=2) console.log('FinancialModelDAO.getAllModels()');

    var defer = q.defer();

    FinancialModel.find({user_id: user_id, active_flag: true}, function (err,list){
        if (err) {
            defer.reject(err);
        } else {
            if (verbose>=3) console.log('  find returned: '+JSON.stringify(list));
            defer.resolve(list);
        }
    });

    return defer.promise;
};
module.exports.dropFinancialModels = function(user_id) {
    var defer = q.defer();

    FinancialModel.remove({user_id: user_id}, function (err,a) {
        if (err) {
            defer.reject(err);
        } else {
            defer.resolve(a);
        }
    });
    return defer.promise;
};

