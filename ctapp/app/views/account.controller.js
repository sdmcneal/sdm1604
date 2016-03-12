'use strict';

angular.module('fsApp.views.ledger',['fsApp.common.models'])

.controller('AccountCtrl', function(
    $scope,
    $http,
    $q,
    LedgerFactory,
    UserFactory,
    ConstantsFactory) {
   var verbose = 1;
   

    init();

    function init() {
        if (verbose) console.log("AccountCtrl.init()");
        $scope.accounts = LedgerFactory.getAccountList();
        
        $scope.test = 123;
        clearForm();   
    }
    
    function clearForm() {
        $scope.account_form = {
            user_id: UserFactory.getCurrentUser(),
            name: '',
            type: '',
            balance: 0.0,
            balance_date: new Date(),
            edit_mode: false,
            _id: ''
        }
        
    }
    $scope.dropAllAccounts = function() {
        var defer = $q.defer();

        $http.get('/api/dropallaccounts')
            .success(function (data, status) {
                if (verbose >= 3) console.log('account collections dropped');
                defer.resolve(data);
            })
            .error(function (data, status) {
                console.log('error dropping account');
                defer.reject(data);
            });

        return defer.promise;
    }
    $scope.createAccount = function() {
        if (verbose>=2) console.log('AccountCtrl.createAccount()');
        var defer = $q.defer();

        if($scope.account_form._id) {
            $scope.updateAccount();
        } else {
            var form = $scope.account_form;

            $http.put('/api/saveaccount', form)
                .success(function (doc, status) {
                    form._id = doc._id;
                    LedgerFactory.addAccount(form);
                    if (verbose >= 3) console.log('saved account: ' + JSON.stringify(doc));
                    clearForm();
                    defer.resolve(form._id);
                })
                .error(function (data, status) {
                    console.log('error saving account');
                    defer.reject(data);
                });
        }

        return defer.promise;
    };
    $scope.updateAccount = function() {
        if (verbose>=2) console.log('AccountCtrl.updateAccount()');
        var defer = $q.defer();

        var form = $scope.account_form;
        if (verbose>=3) console.log('form='+JSON.stringify($scope.account_form));

        $http.put('/api/updateaccount',form)
            .success(function(data,status) {
                if (verbose>=3) console.log('saved account: '+JSON.stringify(data));
                defer.resolve(form._id);

                LedgerFactory.updateAccount(form._id,form.name,
                    form.type,form.balance,form.balance_date);

                clearForm();
            })
            .error(function(data,status) {
                console.log('error saving account');
                defer.reject(data);
            });



        return defer.promise;
    };

    $scope.getAccountCount = function() {
        return LedgerFactory.getAccountCount();
    };

    $scope.editAccount = function(account_id) {
        if (verbose>=2) console.log('AccountCtrl.editAccount('+account_id+')');

        var account = LedgerFactory.getAccountDetails(account_id);
        if (verbose>=3) console.log('  account: '+JSON.stringify(account));

        if (account._id) {
            $scope.account_form = {
                _id: account_id,
                name: account.name,
                type: account.type,
                balance: account.balance,
                balance_date: account.balance_date,
                edit_mode: true
            }
        }
    };
    $scope.getAccountTypes = function() {
        return ConstantsFactory.ASSET_LIST;
    }



});