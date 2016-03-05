'use strict';

angular.module('fsApp.common.models')
.factory('FinancialModelFactory', function(ConstantsFactory,UserFactory) {
    var verbose = 1;
    var models=[];
    var service={};
    var next_financial_model_id;
    var user_id;

    init();

    function init() {
        if (verbose>=2) console.log('FinancialModelFactory.init()');
        next_financial_model_id = ConstantsFactory.FIRST_FINANCIAL_MODEL_ID;
        user_id = UserFactory.getCurrentUser();
    }
    service.createFinancialModel = function(data) {
        if (undefined === data.model_id) {
            data.model_id = next_financial_model_id++;
        }
        if (undefined === data.active_flag) {
            data.active_flag = true;
        }


        data.user_id = user_id;
        models.push(data);

        if (verbose>=3) console.log(' added model: '+JSON.stringify(data));

        return data.model_id;
    };
    service.getFinancialModel = function(model_id) {
        var model = null;

        if (models.length>0) {
            models.forEach(function(a) {
                if (a.model_id==model_id) model = a;
            });
        }
        return model;
    };
    service.updateFinancialModel = function(data) {
        var model = service.getFinancialModel(data.model_id);

        if (model) {
            model.name = data.name;
            model.active_flag = data.active_flag;
        }
    };
    service.getAllFinancialModels = function() {
        return models;
    };
    service.setAllFinancialModels = function(data) {
        models = data;
    }
    return service;
});