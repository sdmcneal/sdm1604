'use strict';

angular.module('fsApp.views.catalog',['fsApp.common.models'])

.controller('CatalogController',function($scope,CatalogFactory,ScheduleFactory,ConstantsFactory,
LedgerFactory) {
   var verbose = true;

   
   init();
   
   function init() {
       if (verbose) console.log('CatalogController.init()');
       clearForm();
       $scope.frequency_options = ConstantsFactory.FREQUENCY_LIST;
       $scope.account_options = LedgerFactory.getAccountList();
       $scope.type_options = ConstantsFactory.TYPE_LIST;
   }

    function clearForm() {
        $scope.catalog_form = {
            description: '',
            parent_id: '',
            catalog_entry_type: ConstantsFactory.FIXED,
            account_id: '',
            paired_account_id: '',
            start_date: new Date(2016,0,1),
            end_date: new Date(2026,11,31),
            amount: 0.0,
            frequency: ConstantsFactory.FREQ_MONTHLY,
            frequency_param: 0,
            param1: '',
            param2: '',
            tax_year_maximum: ''
        }
    }

    $scope.createCatalogEntry = function () {
        CatalogFactory.addCatalogEntry($scope.catalog_form);
    };
   
   $scope.catalogEntryCount = CatalogFactory.getCatalogEntryCount();
   $scope.catalogEntries = CatalogFactory.getCatalogEntries();
   
   
   
});