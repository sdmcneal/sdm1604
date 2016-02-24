'use strict';

angular.module('fsApp.views.ledger',['fsApp.common.models'])

.controller('AccountCtrl', function($scope,$http,LedgerFactory) {
   var verbose = 3;

    init();

    function init() {
        if (verbose) console.log("AccountCtrl.init()");
        $scope.accounts = LedgerFactory.getAccountList();
        
        $scope.test = 123;
        clearForm();   
    }
    
    function clearForm() {
        $scope.account_form = {
            name: '',
            type: '',
            balance: 0.0,
            balance_date: new Date()
        }
        
    }
    
    $scope.createAccount = function() {
        if (verbose>=2) console.log('AccountCtrl.createAccount()');

        var form = $scope.account_form;

        var account = LedgerFactory.addAccount(form.name,form.type,form.balance,form.balance_date);

        $http.put('/api/saveaccount',form)
            .success(function(data,status) {
                if (verbose>=3) console.log('saved account: '+JSON.stringify(data));
            })
            .error(function(data,status) {
                console.log('error saving account');
            });

        clearForm();
    };

    $scope.getAccountCount = function() {
        return LedgerFactory.getAccountCount();
    }

});