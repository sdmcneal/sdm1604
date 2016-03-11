xdescribe('AccountCtrl', function() {
    beforeEach(function() {
        module('fsApp.views.ledger');
        module('fsApp.common.factories.Ledger');
    });
    
    var controller;
    var ledger_factory;
    var $scope = {};
    
    beforeEach(function() {
        inject(function(_$controller_,_$rootScope_,LedgerFactory) {
            var $controller = _$controller_;
            $scope = _$rootScope_;
            ledger_factory = LedgerFactory;
            controller = $controller('AccountCtrl', {$scope: $scope});
        });
    //   $scope.dropAllAccounts()
    //       .then(done);
    });
    describe('createAccount()', function() {
        it('initalizes', function(done) {
            expect(ledger_factory).toBeDefined();
            expect($scope.test).toEqual(123);
            $scope.account_form = {
                name: 'Test Account',
                type: 'Cash',
                balance: '1000.0',
                balance_date: '2016-02-19',
                //_id: "hexadecimal"
            };
            var id;
            $scope.createAccount()
                .then(function(id) {
                    expect($scope.getAccountCount()).toEqual(1);

                    var l = ledger_factory.getJournalEntries(id);
                    expect(l).toBeDefined();
                    expect(l.length).toEqual(1);
                    expect(l[0].balance).toEqual($scope.account_form.balance);
                    done();
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
        it("creates account and gets _id", function (done) {

            $scope.createAccount()
                .then(function(id) {
                    $scope.account_form._id = id;
                    $scope.account_form.balance = 1200.0;

                    $scope.updateAccount()
                        .then(function(id) {
                            var l = ledger_factory.getJournalEntries(id);
                            expect(l).toBeDefined();
                            expect(l.length).toEqual(1);
                            expect(l[0].balance).toEqual(1200.0);
                            done();
                        })
                        .fail(function(err){
                            done(err);
                        });
                });
        });
        it("updates account without error", function() {

        });
    });
});