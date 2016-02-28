var dao = require('./fsDAO');
var expect = require('expect.js');
var models = require('./fsmodels');

describe('fsDAO', function() {
    it('create account', function() {
        var new_account = new models.Account( {
            user_id: 4500,
            account_id: 20001,
            name: 'fsDAO test account 1',
            type: 'cash',
            balance: 12000.0,
            balance_date: new Date()
        });
        dao.saveAccount(new_account).then(function(response) {
                expect(response.user_id).toEqual(4500);
            }
        );
    })

});