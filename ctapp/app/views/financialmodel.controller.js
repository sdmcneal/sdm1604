'use strict';

angular.module('fsApp.views.FinancialModel',['fsApp.common.models'])
.controller('FinancialModelController', function($scope,$http,FinancialModelFactory,UserFactory) {
    var verbose = 1;
    var user_id;

    init();

    function init() {
        if (verbose>=2) console.log('FinancialModelController.init()');

        user_id = UserFactory.getCurrentUser();
        clearForm();
        $scope.financialModels = FinancialModelFactory.getAllFinancialModels();
        
    }
    function clearForm() {
        $scope.financial_form = {
            model_name: '',
            active_flag: true,
            user_id: 0,
            create_date: new Date(),
            model_id: 0,
            edit_mode: false
        }
    }
    $scope.createFinancialModel = function() {
        if (verbose>=2) console.log('FinancialModelController.createModel()');

        var form = $scope.financial_form;

        form.user_id = this.user_id;
        
        form.model_id = FinancialModelFactory.createFinancialModel(form);
        
        $http.put('/api/savefinancialmodel', form)
        .success( function (data,status) {
            if (verbose>=3) console.log('  saved model:' +
            JSON.stringify(data));
            
            
        })
        .error(function (data,status) {
            console.log('  error saving model');
        });

    }
    $scope.getAllFinancialModels = function() {
        if (verbose>=2) console.log("FinancialModelController.getAllFinancialModels()");
        
        return $scope.financialModels;
    }
    $scope.loadFinancialModels = function () {
        if (verbose>=2) console.log("FinancialModelController.getAllFinancialModels()");
        
        
        $http.get('/api/getallfinancialmodels/'+user_id)
        .success( function (data) {
            FinancialModelFactory.setAllFinancialModels(data);
            $scope.financialModels = FinancialModelFactory.getAllFinancialModels();
            if (verbose>=3) console.log(' list:'+JSON.stringify(data));
        })
        .error(function(err) {
            if (verbose>=1) console.log('  error getting models');
        });
        
    }
});