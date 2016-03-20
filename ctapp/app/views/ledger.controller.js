app.controller('LedgerController', function($scope,LedgerFactory) {
   var verbose = true;
    $scope.accounts = LedgerFactory.account_list;
    $scope.getLedger = function (account_id) {
        return LedgerFactory.getJournalEntries(account_id);
    }
    $scope.account_list = LedgerFactory.getAccountList();
    $scope.current_account = '';
    
    init();

    function init() {
        if (verbose) console.log('LedgerController.init()');
        $scope.current_account = $scope.account_list[0].account_object_id;
    }

    
});