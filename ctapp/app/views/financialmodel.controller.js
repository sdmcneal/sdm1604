'use strict';

angular.module('fsApp.views.FinancialModel',['fsApp.common.models'])
.controller('FinancialModelController', function($scope,$http,UserFactory) {
    var verbose = 3;
    var user_id;

    init();

    function init() {
        if (verbose>=2) console.log('FinancialModelController.init()');

        user_id = UserFactory.getCurrentUser();
        clearForm();
    }
    function clearForm() {
        $scope.financial_form = {
            model_name: '',
            active_flag: true,
            create_date: new Date(),
            model_id: 0,
            edit_mode: false
        }
    }
    $scope.createModel = function() {
        if (verbose>=2) console.log('FinancialModelController.createModel()');

        var form = $scope.financial_form;

        form.user_id = this.user_id;
        
        $http.put('/api/savefinancialmodel', form)
        .success( function (data,status) {
            if (verbose>=3) console.log('  saved model:' +
            JSON.stringify(data));
            
            //form.model_id = Fin
        })
        .error(function (data,status) {
            console.log('  error saving model');
        });

    }
});