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
            balance_date: new Date(),
            edit_mode: false
        }
        
    }
    
    $scope.createAccount = function() {
        if (verbose>=2) console.log('AccountCtrl.createAccount()');

        if($scope.account_form.account_id) {
            $scope.updateAccount();
        } else {
            var form = $scope.account_form;

            form.account_id = LedgerFactory.addAccount(form);

            $http.put('/api/saveaccount', form)
                .success(function (data, status) {
                    if (verbose >= 3) console.log('saved account: ' + JSON.stringify(data));
                })
                .error(function (data, status) {
                    console.log('error saving account');
                });
        }
        clearForm();
    };
    $scope.updateAccount = function() {
        if (verbose>=2) console.log('AccountCtrl.updateAccount()');

        var form = $scope.account_form;
        if (verbose>=3) console.log('form='+JSON.stringify($scope.account_form));

        form.account_id = LedgerFactory.updateAccount(form.account_id,form.name,form.type,form.balance,form.balance_date);

        $http.put('/api/updateaccount',form)
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
    };

    $scope.editAccount = function(account_id) {
        if (verbose>=2) console.log('AccountCtrl.editAccount('+account_id+')');

        var account = LedgerFactory.getAccountDetails(account_id);
        if (verbose>=3) console.log('  account: '+JSON.stringify(account));

        if (account.account_id) {
            $scope.account_form = {
                account_id: account_id,
                name: account.name,
                type: account.type,
                balance: account.balance,
                balance_date: account.balance_date,
                edit_mode: true
            }
        }
    };
    $scope.dropAllAccounts = function() {
        $http.get('/api/dropallaccounts')
            .success(function (data, status) {
                if (verbose >= 3) console.log('account collections dropped');
            })
            .error(function (data, status) {
                console.log('error dropping account');
            });
    };


});