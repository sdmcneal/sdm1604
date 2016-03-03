var dao = require('../models/FinancialModelDAO');
var expect = require("chai").expect;
var FinancialModel = require('../models/FinancialModel');
var USER_ID = 5000;
var MODEL_ID = 6000;

describe('models.FinancialModelDAO', function () {
    it('should drop all user models without error', function (done) {
        dao.dropFinancialModels(USER_ID)
            .then(done())
            .fail(function (err) {
                done(err);
            });
    });
    it('should save a model without errors', function (done) {
        var new_model = new FinancialModel({
            user_id: USER_ID,
            model_id: MODEL_ID,
            model_name: "mocha model 1",
            create_date: new Date(),
            active_flag: true
        });
        dao.saveFinancialModel(new_model)
            .then(done())
            .fail(function (err) {
                done(err);
            });
    });
    it('should retrieve one model', function (done) {
        dao.getAllFinancialModels(USER_ID)
            .then(function (list) {
                expect(list.length).to.equal(1);
                done();
            })
            .fail(function (err) {
                done(err);
            });
    });
    it('should update one model and get single model', function (done) {
        var MODIFIED = "mocha modified model 1";

        dao.getFinancialModel({user_id: USER_ID, model_id: MODEL_ID})
            .then(function (model) {
                model.model_name = MODIFIED;
                model.active_flag = false;

                dao.updateFinancialModel(model)
                    .then(function () {
                        dao.getFinancialModel({user_id: USER_ID, model_id: MODEL_ID})
                            .then(function (model) {

                                expect(model.model_name).to.equal(MODIFIED);
                                expect(model.active_flag).to.equal(false);
                                done();
                            })
                            .fail(function (err) {
                                done(err);
                            });
                    })
                    .fail(function (err) {
                        done(err);
                    });
            })
            .fail(function (err) {
                    done(err);
                })
            });

    });
