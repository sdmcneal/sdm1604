'use strict';

angular.module('fsApp.views.catalog', ['fsApp.common.models'])

.controller('CatalogController', function($scope, $http, CatalogFactory, ScheduleFactory, ConstantsFactory,
    LedgerFactory, UserFactory) {
    var verbose = 3;
    var user_id;


    init();

    function init() {
        if (verbose) console.log('CatalogController.init()');
        clearForm();
        $scope.frequency_options = ConstantsFactory.FREQUENCY_LIST;
        $scope.account_options = LedgerFactory.getAccountList();
        $scope.type_options = ConstantsFactory.TYPE_LIST;
        user_id = UserFactory.getCurrentUser();
    }

    function clearForm() {
        $scope.catalog_form = {
            user_id: user_id,
            description: '',
            parent_id: '',
            catalog_entry_type: ConstantsFactory.FIXED,
            account_id: '',
            paired_account_id: '',
            start_date: new Date(2016, 0, 1),
            end_date: new Date(2016, 11, 31),
            amount: 0.0,
            amount_calc: 0.0,
            frequency: ConstantsFactory.FREQ_MONTHLY,
            frequency_param: 0,
            param1: '',
            param2: '',
            tax_year_maximum: '',
            edit_mode: false
        }
    }

    $scope.catalogEntryCount = CatalogFactory.getCatalogEntryCount();
    $scope.catalogEntries = CatalogFactory.getCatalogEntries();

    $scope.createCatalogEntry = function() {
        if (verbose >= 2) console.log('CatalogController.createCatalog()');


        var form = $scope.catalog_form;

        form.user_id = UserFactory.getCurrentUser();
        $http.get('/api/getnextcatalogid/' + user_id)
            .success(function(id) {
                if (verbose>=3) console.log('  id: '+id);
                form.catalog_entry_id = id;

                $http.put('/api/savecatalog', form)
                    .success(function(data, status) {
                        if (verbose >= 3) console.log('saved catalog: ' + JSON.stringify(data));
                    
                        CatalogFactory.addCatalogEntry(form);
                    })
                    .error(function(data, status) {
                        console.log('error saving catalog');
                    });

                clearForm();
            })
            .error(function(err) {
                if (verbose>=1) console.log('  error getting next id: '+err);
            });
    };
    $scope.updateCatalogEntry = function() {
        if (verbose >= 2) console.log('CatalogController.updateCatalogEntry()');

        var form = $scope.catalog_form;

        $http.put('/api/updatecatalogentry', form)
            .success(function(data, status) {
                if (verbose >= 3) console.log('  updated catalog: ' +
                    JSON.stringify(data));
                CatalogFactory.updateCatalogEntry(form);
            })
            .error(function(data, status) {
                if (verbose >= 1) console.log('  error updating catalog: ' +
                    data);
            });
    }
    $scope.getAllCatalogEntries = function() {
        if (verbose >= 2) console.log('CatalogController.getAllCatalogEntries()');


        $http.get('/api/getallcatalogentries')
            .success(function(data) {
                CatalogFactory.setCatalogEntries(data);
                $scope.catalogEntries = CatalogFactory.getCatalogEntries();
                $scope.catalogEntryCount = CatalogFactory.getCatalogEntryCount();
            })
            .error(function(err) {
                console.log('  error getting catalog: ' + err);
            });
    };
    $scope.editCatalog = function(id) {
        if (verbose >= 2) console.log("CatalogController.editCatalog()");

        var entry = CatalogFactory.getCatalogEntry(id);

        $scope.catalog_form = {
            catalog_entry_id: entry.catalog_entry_id,
            user_id: entry.user_id,
            description: entry.description,
            parent_id: entry.parent_id,
            catalog_entry_type: entry.catalog_entry_type,
            account_id: entry.account_id,
            paired_account_id: entry.paired_account_id,
            start_date: entry.start_date,
            end_date: entry.end_date,
            amount: entry.amount,
            amount_calc: entry.amount_calc,
            frequency: entry.frequency,
            frequency_param: entry.frequency_param,
            param1: entry.param1,
            param2: entry.param2,
            tax_year_maximum: entry.tax_year_maximum,
            edit_mode: true
        }
    };
    $scope.deleteCatalogEntry = function(id) {
        if (verbose >= 2) console.log("CatalogController.deleteCatalogEntry()");

        var url = '/api/dropcatalog/' + user_id + "/" + id;
        if (verbose >= 3) console.log('  url: ' + url);

        $http.get(url)
            .success(function(data) {
                CatalogFactory.removeCatalogEntry(id);
            })
            .error(function(err) {
                if (verbose >= 1) console.log(' error deleting: ' + err);
            });
    }
});