var async = require('async');
var Catalog = require('./Catalog');
var Account = require('./Account');
var mongoose = require('mongoose');
var db;
var USER_ID = 5000;
var ACCOUNT_DATE = new Date(2016,1,1);

var constants = {};

constants.FREQ_MONTHLY = "monthly";
            constants.FREQ_FIRST_DAY_OF_MONTH = "first day each month";
            constants.FREQ_FIRST_WEEKDAY_OF_MONTH = "first weekday each month";
            constants.FREQ_LAST_DAY_OF_MONTH = "last day each month";
            constants.FREQ_LAST_WEEKDAY_OF_MONTH = "last weekday each month";
            constants.FREQ_WEEKLY = "weekly";

constants.FIXED = "fixed";
            constants.TYPE_INTEREST_ON_BALANCE = "interest on balance";
            constants.TYPE_LOAN_PAYMENT = "loan payment";
            constants.TYPE_ESCALATING = "fixed escalating";

var checking = new Account({ user_id: USER_ID, name: "Checking", type: "cash", balance: 2000.0, balance_date: ACCOUNT_DATE });
var savings = new Account({ user_id: USER_ID, name: "Savings", type: "cash", balance: 5000.0, balance_date: ACCOUNT_DATE });
var brokerage = new Account({ user_id: USER_ID, name: "Brokerage", type: "cash", balance: 10000.0, balance_date: ACCOUNT_DATE });

var range_start = new Date(2016,0,1);
var range_end = new Date(2016,11,30);



var accounts = [
    checking,
    savings,
    brokerage
    ];
var catalogs = [];
    
var start = Date.now();
console.log('start = '+start);

    
function opendb(callback) {
    mongoose.connect('mongodb://localhost/fs-stage');
    db = mongoose.connection;

    db.on('error',console.error.bind(console,'connection error: '));
    db.once('open', function() {
        console.log('fs database connected');
        return callback(null,'open database');
    });
}

function dropAccounts(callback) {
    db.collection('accounts').drop( function( err, response) {
        if (err) console.log('error: '+err);
        console.log('accounts dropped');
        return callback(null,'delete accounts');
    });
}
function dropCatalogs(callback) {
    db.collection('catalogs').drop( function( err, response) {
        if (err) console.log('error: '+err);
        console.log('catalogs dropped');
        return callback(null,'delete catalog');
    });
}
function createAccounts(callback) {
    console.log('createAccounts');
    async.each(accounts, function(account,cb) {
        var s = Date.now();
        account.save(function(err,doc) {
            console.log('added in '+(Date.now()-s)+': '+
            account.name+' with _id: '+account._id);
            
            return cb(err,doc);
            
        });
    },function() {
        console.log('create done');
        return callback();
    });
}
function createCatalogs(callback) {
    console.log('createCatalogs()');
    async.each(catalogs, function(catalog,cb) {
        var s = Date.now();
        catalog.save(function(err,doc) {
            console.log('added in '+(Date.now()-s)+': '+
            catalog.description+' with _id: '+catalog._id);
            
            return cb(err,doc);
            
        });
    },function() {
        console.log('create done');
        return callback();
    });
}

function init_catalogs(cb) {
    var catalog_entry_id = 6000;
    var hoa_catalog = new Catalog( {
        user_id: USER_ID,
        account_object_id: checking._id,
        catalog_entry_id: catalog_entry_id++,
        catalog_entry_type: constants.FIXED,
        paired_account_id: null,
        description: "HOA",
        frequency: constants.FREQ_MONTHLY,
        frequency_param: 2,
        amount: -75,
        amount_calc: 0.0,
        param1: null,
        param2: null,
        tax_year_maximum: 0.0,
        start_date: range_start,
        end_date: range_end
    });
    catalogs.push(hoa_catalog);
    
    var salary1_catalog = new Catalog( {
        user_id: USER_ID,
        catalog_entry_id: catalog_entry_id++,
        account_object_id: checking._id,
        catalog_entry_type: constants.FIXED,
        paired_account_object_id: null,
        description: "Salary",
        frequency: constants.FREQ_LAST_WEEKDAY_OF_MONTH,
        frequency_param: 0,
        amount: 5000.0,
        amount_calc: 0.0,
        param1: null,
        param2: null,
        tax_year_maximum: 0.0,
        start_date: range_start,
        end_date: range_end
    });
    catalogs.push(salary1_catalog);
    cb();
}
async.series([
    opendb,
    dropAccounts,
    dropCatalogs,
    createAccounts,
    init_catalogs,
    createCatalogs
    ],
    function(err,results) {
        if (err) {
            console.log('error: '+err);
        }
        //console.log(results);
        var end = Date.now();
        console.log('end: '+end);
        console.log('elapsed: '+(end-start));
        process.exit(0);
    }); 
//db.close();
//process.exit(0);