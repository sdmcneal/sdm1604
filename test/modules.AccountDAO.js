var dao = require('../models/AccountDAO');
var expect = require("chai").expect;
var Account = require('../models/Account');
var chaiAsPromised = require("chai-as-promised");

describe('models.AccountDAO', function() {
    it('should drop account collection without error', function(done) {
        dao.dropAllAccounts()
            .then(function() {
                done();
            });
    });
    it('should save an account without errors', function(done) {
        var new_account = new Account({
            user_id: 5000,
            account_id: 2000,
            name: "mocha account 1",
            type: "cash",
            balance: 8000.0,
            balance_date: new Date(2016,1,15)
        });

        dao.saveAccount(new_account)
            .then(done())
            .fail(function(err) {
                done(err);
            });
    });
    it('should have 1 record', function(done){
        Account.find({},function(err,docs) {
            expect(err).to.not.exist;
            expect(docs).to.have.length(1);
            done();
        });
    });
    it('should update 1 record',function(done) {
        var updated_account = new Account({
            user_id: 5000,
            account_id: 2000,
            name: "mocha account 1",
            type: "cash",
            balance: 7000.0,
            balance_date: new Date(2016,2,16)
        });
        dao.updateAccount(updated_account)
            .then(function() {
                Account.findOne({account_id:2000},function(err,doc) {
                    expect(err).to.not.exist;
                    expect(doc.balance).to.equal(7000.0);
                    done();
                });
            });

    });
    it('should retrieve multiple records',function(done) {
        var new_account = new Account({
            user_id: 5000,
            account_id: 2001,
            name: "mocha account 3",
            type: "cash",
            balance: 8000.0,
            balance_date: new Date(2016,1,15)
        });

        dao.saveAccount(new_account)
            .then(function() {
                dao.getAllAccounts(5000)
                    .then( function(records) {
                        expect(records.length).to.equal(2);
                        expect(records[1].account_id).to.equal(2001);
                        done();
                    });
            });
    });
});