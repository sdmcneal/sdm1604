describe('AccountCtrl', function() {
    beforeEach(module('fsApp.views.ledger'));
    
    var $controller;
    
    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;
    }));
    
    describe('accounts', function() {
        it('initalizes', function() {
            var $scope = {};
            var controller = $controller('AccountCtrl', {$scope: $scope});
            
            expect($scope.test).toEqual(123);
            $scope.account_form = {
                name: 'Test Account',
                type: 'Cash',
                balance: '1000.0',
                balance_date: '2016-02-19'
            };
            $scope.createAccount();
            expect($scope.getAccountCount()).toEqual(1);
        });
    });
});