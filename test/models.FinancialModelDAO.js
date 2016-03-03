var dao = require('../models/FinancialModelDAO');
var expect = require("chai").expect;
var FinancialModel = require('../models/FinancialModel');

describe('models.FinancialModelDAO', function() {
    it('should drop all user models without error', function(done) {

    });
    it('should save a model without errors', function(done) {
        var new_model = new FinancialModel( {
            user_id: 5000,
            model_id: 6000,
            model_name: "mocha model 1",
            create_date: new Date(),
            active_flag: true
        });

    })
});