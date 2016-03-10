'use strict';

angular.module('fsApp.common.factories.Catalog',['fsApp.common.models'])
.factory('CatalogFactory', function (ScheduleFactory, ConstantsFactory, CalculationEngine) {
        var verbose = 1;
        var catalog_entries = [];
        var service = {};
        var next_catalog_entry_id;

        init();

        function init() {
            if (verbose>=2) console.log('CatalogFactory.init()');
            next_catalog_entry_id = ConstantsFactory.FIRST_CATALOG_ENTRY_ID;
        }

        service.addCatalogEntry = function (form) {

            if (verbose>=2) console.log('CatalogFactory.addCatalogEntry()');

            var new_catalog_entry = {
                user_id: form.user_id,
                _id: form._id,
                parent_catalog_entry_id: form.parent_catalog_entry_id,
                account_object_id: form.account_object_id,
                paired_account_object_id: form.paired_account_object_id,
                catalog_entry_type: form.catalog_entry_type,
                description: form.description,
                frequency: form.frequency,
                frequency_param: form.frequency_param,
                amount: form.amount,
                amount_calc: form.amount_calc,
                param1: form.param1,
                param2: form.param2,
                tax_year_maximum: form.tax_year_maximum
            };


            if (form.start_date)
                new_catalog_entry.start_date = new Date(form.start_date);
            else
                new_catalog_entry.start_date = new Date();
            if (form.end_date) {
                new_catalog_entry.end_date = new Date(form.end_date);
            }
            else {
                new_catalog_entry.end_date = new Date();
                new_catalog_entry.end_date.setFullYear(2100);
            }

            catalog_entries.push(new_catalog_entry);
            if (verbose>=3) console.log(' catalog_entries: '+JSON.stringify(catalog_entries));
            ScheduleFactory.generateScheduleFromCatalog(new_catalog_entry);

            //
            // TODO: placeholder to test create schedule
            //
            //var schedule = CalculationEngine.calculateMonthlyScheduleDate(1, new Date(2016, 0, 12),
            //  new Date(2100, 0, 1), new Date(2016, 1, 14));
            //
            //schedule = CalculationEngine.calculateLastDayOfMonths(new Date(2016, 0, 12),
            //  new Date(2100, 0, 1), new Date(2016, 1, 14));
            //
            //schedule = CalculationEngine.calculateLastWeekdayOfMonths(new Date(2016, 0, 12),
            //  new Date(2100, 0, 1), new Date(2016, 1, 14));

            //schedule.forEach(function(d) {
            //    d.setDate(d.getDate()-1);
            //    console.log(d.toDateString());
            //});
            //
            //console.log(JSON.stringify(schedule));

            //ScheduleFactory.addScheduleEntry(new_catalog_entry.catalog_entry_id, new_catalog_entry.start_date,
            //  account_id, amount, new_catalog_entry.amountamount_calc);

            return new_catalog_entry.catalog_entry_id;
        };
        service.updateCatalogEntry = function (form) {
          if (verbose>=2) console.log('CatalogFactory.updateCatalogEntry()');
          service.removeCatalogEntry(form._id);
          service.addCatalogEntry(form);
        }
        service.removeCatalogEntry=function(id) {
          // remove all the scheduled items first
          ScheduleFactory.removeScheduleFromCatalog(id);
          
          // remove from array
          var i;
          
          for (i=0;i<catalog_entries.length;i++) {
            if (id==catalog_entries[i]._id) {
              catalog_entries.splice(i,1);
            }
          }
        }
        service.getCatalogEntryCount = function () {
            return catalog_entries.length;
        };

        service.getCatalogEntries = function () {
            return catalog_entries;
        };
        service.setCatalogEntries = function (list) {
          catalog_entries = list;
        };
        service.getCatalogEntry = function (catalog_entry_object_id) {
          var i;
          var entry;
          
          for (i=0;i<catalog_entries.length;i++) {
            if (catalog_entries[i]._id==catalog_entry_object_id) {
              entry = catalog_entries[i];
              i=catalog_entries.length;
            }
          }
          if (undefined===entry) {
            if (verbose>=1) console.log('  no catalog found with id: '+
            catalog_entry_object_id);
          }
          return entry;
        }

        return service;
    })