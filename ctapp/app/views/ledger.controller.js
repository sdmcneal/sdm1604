app.controller('LedgerController', function($scope,LedgerFactory) {
   var verbose = true;

    init();

    function init() {
        if (verbose) console.log('LedgerController.init()');

    }

    $scope.accounts = LedgerFactory.account_list;
    $scope.getLedger = function (account_id) {
        return LedgerFactory.getJournalEntries(account_id);
    }
});