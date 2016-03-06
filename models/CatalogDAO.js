'use strict';

var db = require('./DbConnection');
var Catalog = require('./Catalog');
var q = require('q');
var verbose = 3;


module.exports.updateCatalog = function(data) {
    if (verbose>=2) console.log('fsDAO.updateCatalog()');
    var deferred = q.defer();

    Catalog.findOne({catalog_entry_id: data.catalog_entry_id}, function(err,doc) {
        if (err) {
            deferred.reject(err);
        } else {

            doc.parent_catalog_entry_id = data.parent_catalog_entry_id;
            doc.account_id = data.account_id;
            doc.paired_account_id = data.paired_account_id;
            doc.catalog_entry_type = data.catalog_entry_type;
            doc.description = data.description;
            doc.frequency = data.frequency;
            doc.frequency_param = data.frequency_param;
            doc.amount = data.amount;
            doc.amount_calc = data.amount_calc;
            doc.param1 = data.param1;
            doc.param2 = data.param2;
            doc.tax_year_maximum = data.tax_year_maximum;
            doc.start_date = data.start_date;
            doc.end_date = data.end_date;
            doc.save(function(err,a) {
                if (err) {
                    deferred.reject(err);
                } else {
                    if (verbose>=3) console.log('  updated catalog: '+JSON.stringify(a));
                    deferred.resolve(a);
                }
            });
        }
    });
    return deferred.promise;
};
module.exports.dropAllCatalogs = function() {
    if (verbose>=2) console.log('CatalogDAO.dropAllCatalogs()');
    var deferred = q.defer();

    db.dropCollection('catalogs', function(err,result) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};
module.exports.dropCatalog = function(user_id, id) {
    if (verbose>=2) console.log('CatalogDAO.dropCatalog()');
    if (verbose>=3) console.log('  user_id='+user_id+' id='+id);
    
    var deferred = q.defer();

    Catalog.findOneAndRemove({user_id: user_id, _id: id},
    function(err,result) {
        if (err) {
            if (verbose>=1) console.log('  drop error'+err);
            deferred.reject(err);
        } else {
            if (verbose>=3) console.log('  drop result:'+JSON.stringify(result));
            deferred.resolve(result);
        }
    });
    return deferred.promise;
};

module.exports.saveCatalog = function(data) {
    if (verbose>=2) console.log('CatalogDAO.saveCatalog()');
    if (verbose>=3) console.log('  data passed: '+JSON.stringify(data));
    var defered = q.defer();

    var new_catalog = new Catalog( {
        user_id: data.user_id,
        catalog_entry_id: data.catalog_entry_id,
        parent_catalog_entry_id: data.parent_catalog_entry_id,
        account_id: data.account_id,
        catalog_entry_type: data.catalog_entry_type,
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
        defered.resolve(a);
    });

    return defered.promise;
};
module.exports.getAllCatalogEntries = function(user_id) {
    if (verbose>=2) console.log('fsDAO.getAllCatalogEntries()');

    var defer = q.defer();

    Catalog.find({user_id:user_id},function(err,list) {
        if (err) {
            defer.reject(err);
        } else {
            if (verbose>=3) console.log('  find returned: '+JSON.stringify(list));
            defer.resolve(list);
        }
    });
    return defer.promise;

};
module.exports.getNextId = function(user_id) {
    if (verbose>=2) console.log('CatalogDAO.getNextId()');
    
    var defer = q.defer();
    
    Catalog.findOne({user_id: user_id}).sort({catalog_entry_id: -1})
    .exec(function (err,doc) {
        if (err) {
            defer.reject(err);
        } else {
            if (verbose>=3) console.log('  result: '+JSON.stringify(doc));
            defer.resolve(doc.catalog_entry_id+1);
        }
    });
    
    return defer.promise;
    
}