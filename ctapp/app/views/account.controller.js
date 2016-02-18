'use strict';

angular.module('fsApp.views.ledger',[]);

angular.module('fsApp.views.ledger')

.controller('AccountCtrl', function($scope,LedgerFactory) {
   var verbose = true;

    init();

    function init() {
        if (verbose) console.log("AccountCtrl.init()");

    }

});