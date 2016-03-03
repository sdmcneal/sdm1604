'use strict';

angular.module('fsApp.views.FinancialModel',['fsApp.common.models'])
.controller('FinancialModelController', function($scope,$http,UserFactory) {
    var verbose = 3;
    var user_id;

    init();

    function init() {
        if (verbose>=2) console.log('FinancialModelController.init()');

        user_id = UserFactory.getCurrentUser();
    }
    function clearForm() {

    }
    $scope.createModel = function() {
        if (verbose>=2) console.log('FinancialModelController.createModel()');

        var form = $scope.model_form;

        form.user_id = this.user_id;

    }
});