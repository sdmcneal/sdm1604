'use strict';

angular.module('fsApp.views.ledger',['fsApp.common.models'])

.controller('AccountCtrl', function($scope,LedgerFactory) {
   var verbose = true;

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
            balance: '',
            balance_date: new Date()
        }
        
    }
    
    $scope.createAccount = function() {
        var form = $scope.account_form;
        var _balance = Number(form.balance);
        var _balance_date = new Date(form.balance_date);
        
        var account = LedgerFactory.addAccount(form.name,form.type,form.balance,form.balance_date);
        clearForm();
    }
    $scope.getAccountCount = function() {
        return LedgerFactory.getAccountCount();
    }

});