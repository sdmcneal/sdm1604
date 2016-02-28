'use strict';

angular.module('fsApp.views.catalog',['fsApp.common.models'])

.controller('CatalogController',function($scope,$http,CatalogFactory,ScheduleFactory,ConstantsFactory,
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
            end_date: new Date(2016,11,31),
            amount: 0.0,
            amount_calc: 0.0,
            frequency: ConstantsFactory.FREQ_MONTHLY,
            frequency_param: 0,
            param1: '',
            param2: '',
            tax_year_maximum: ''
        }
    }

   $scope.catalogEntryCount = CatalogFactory.getCatalogEntryCount();
   $scope.catalogEntries = CatalogFactory.getCatalogEntries();
   
   $scope.createCatalogEntry = function() {
        if (verbose>=2) console.log('CatalogController.createCatalog()');

        
        var form = $scope.catalog_form;

        form.catalog_entry_id = CatalogFactory.addCatalogEntry($scope.catalog_form);

        $http.put('/api/savecatalog',form)
            .success(function(data,status) {
                if (verbose>=3) console.log('saved catalog: '+JSON.stringify(data));
            })
            .error(function(data,status) {
                console.log('error saving catalog');
            });

        clearForm();
    };
    $scope.getAllCatalogEntries = function() {
        if (verbose>=2) console.log('CatalogController.getAllCatalogEntries()');
        
        $http.get('/api/getallcatalogentries')
        .success(function(data) {
            CatalogFactory.setCatalogEntries(data);
            $scope.catalogEntries = CatalogFactory.getCatalogEntries();
        })
        .error(function(err) {
            console.log('  error getting catalog: '+ err);
        });
    };
   
   
});