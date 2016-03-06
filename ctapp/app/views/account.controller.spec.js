describe('AccountCtrl', function() {
    beforeEach(module('fsApp.views.ledger'));
    
    var controller;
    var $scope = {};
    
    beforeEach(function(done) {
        inject(function(_$controller_) {
            var $controller = _$controller_;
            controller = $controller('AccountCtrl', {$scope: $scope});
        });
    //   $scope.dropAllAccounts()
    //       .then(done);
    });
    describe('createAccount()', function() {
        it('initalizes', function() {

            expect($scope.test).toEqual(123);
            $scope.account_form = {
                name: 'Test Account',
                type: 'Cash',
                balance: '1000.0',
                balance_date: '2016-02-19',
                //_id: "hexadecimal"
            };
            $scope.createAccount()
                .then(function() {
                    expect($scope.getAccountCount()).toEqual(1);
                });
        });
    });
    describe('updateAccount()', function() {
        beforeEach(function() {


            $scope.account_form = {
                name: 'Test Account',
                type: 'Cash',
                balance: '1000.0',
                balance_date: '2016-02-19',
                //_id: "hexadecimal"
            };

        });
        it("creates account and gets _id", function () {
            $scope.createAccount()
                .then(function() {
                    expect($scope.getAccountCount()).toEqual(1);
                    expect($scope.account_form._id).toBeDefined();
                });
        });
        it("updates account without error", function() {

        });
    });
});