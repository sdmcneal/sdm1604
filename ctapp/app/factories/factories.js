'use strict';

angular.module('fsApp.common.models', [
    'fsApp.common.factories.Catalog',
    'fsApp.common.factories.Ledger'
])
    .factory('CrumbFactory', function () {
        return {
            data: {
                user: 99,
                trip: 88,
                route: 77,
                crumbs: []
            }
        };
    })
    .factory('MapFactory', function () {
        return {
            map: '',
            setMap: function (_map) {
                console.log("setMap()");
                this.map = _map;
            }
        };
    })
    .factory('ScheduleFactory', function (ConstantsFactory,CalculationEngine,LedgerFactory) {
        var verbose = 1;
        var schedule_entries = [];
        var service = {};
        var next_schedule_entry_id;
        var range_start_date, range_end_date;

        init();

        function init() {
            if (verbose>=2) console.log('ScheduleFactory.init()');
            next_schedule_entry_id = ConstantsFactory.FIRST_SCHEDULE_ENTRY_ID;
            range_start_date = ConstantsFactory.DEFAULT_RANGE_START;
            range_end_date = ConstantsFactory.DEFAULT_RANGE_END;
        }
        service.removeScheduleFromCatalog = function(catalog_entry_id) {
          var i;
          var o=0;
          
          // TODO: this could become expensive transaction over time
          for (i=0;i<schedule_entries.length;i++) {
            if (schedule_entries[i].catalog_entry_id==catalog_entry_id) {
              schedule_entries.splice(i,1);
              o++;
            }
          }
          if (verbose>=3) console.log('  removed instances: '+o);
        }
        service.generateJournalEntriesForLoanPayment = function(entry) {
            if (verbose>=2) console.log('ScheduleFactory.generateJournalEntriesForLoanPayment()');

            // paired account is liability account
            var last_liability_account_balance = LedgerFactory.getLastBalance(entry.paired_account_id);
            var interest_amount = last_liability_account_balance * entry.amount_calc;
            var principle_adjustment = interest_amount - entry.amount;
            
            // deduction journal
            LedgerFactory.addJournalEntry(entry.account_id,
                                entry.schedule_date, entry.schedule_entry_id,
                                entry.description,
                                entry.amount);
                              
            // interest adjustment
            LedgerFactory.addJournalEntry(entry.paired_account_id,
            entry.schedule_date,entry.schedule_entry_id,entry.description + ' interest',
            interest_amount);
            
            // principle adjustment
            LedgerFactory.addJournalEntry(entry.paired_account_id,
            entry.schedule_date,entry.schedule_entry_id,entry.description,
            -entry.amount);
            
            
        };
        service.runSchedule = function() {
          LedgerFactory.resetLedgers();
            if (0<schedule_entries.length) {
                schedule_entries.sort(function(a,b) {
                    return (a.schedule_date - b.schedule_date);
                });
                schedule_entries.forEach(function(entry) {
                    if (verbose>=3) console.log('ScheduleFactory.runSchedule() journal entry:'+ JSON.stringify(entry));
                    switch (entry.catalog_entry_type) {
                        case ConstantsFactory.FIXED:
                            LedgerFactory.addJournalEntry(entry.account_id,
                            entry.schedule_date, entry.schedule_entry_id,
                            entry.description,
                            entry.amount);
                            break;
                        case ConstantsFactory.TYPE_INTEREST_ON_BALANCE:
                            var last_balance = LedgerFactory.getLastBalance(entry.account_id);
                            var calc_amount = last_balance * entry.amount_calc;
                            LedgerFactory.addJournalEntry(entry.account_id,
                                entry.schedule_date, entry.schedule_entry_id,
                                entry.description,
                                calc_amount);
                            break;
                        case ConstantsFactory.TYPE_LOAN_PAYMENT:
                            service.generateJournalEntriesForLoanPayment(entry);
                            break;
                    }
                });
            }
        };
        service.addScheduleEntry = function (date,data) {
            //catalog_entry_type,catalog_entry_id, schedule_date,
            //                                 account_id,paired_account_id,amount, amount_calc,description) {

            if (verbose>=2) console.log('ScheduleFactory.addScheduleEntry()');

            var new_schedule_entry = {
                schedule_entry_id: next_schedule_entry_id++,

                catalog_entry_id: data.catalog_entry_id,
                catalog_entry_object_id: data.catalog_entry_object_id,
                catalog_entry_type: data.catalog_entry_type,
                schedule_date: date,
                account_id: data.account_id,
                account_object_id: data.account_object_id,
                paired_account_id: data.paired_account_id,
                paired_account_object_id: data.paired_account_object_id,
                amount: data.amount,
                amount_calc: data.amount_calc,
                description: data.description
            };

            schedule_entries.push(new_schedule_entry);
            if (verbose>=3) console.log("saving schedule: "+JSON.stringify(new_schedule_entry));

            return new_schedule_entry.schedule_entry_id;
        };
        service.getScheduleEntryCount = function () {
            return schedule_entries.length;
        };
        service.getScheduleEntries = function () {
            return schedule_entries;
        };
        service.setRangeStartDate = function (start_date) {
            range_start_date = start_date;
        };
        service.setRangeEndDate = function (end_date) {
            range_end_date = end_date;
        };
        service.saveFixedSchedule = function(schedule,catalog_entry) {
            schedule.forEach(function (entry) {


                service.addScheduleEntry(entry,catalog_entry);
                //    catalog_entry.catalog_entry_type,catalog_entry.catalog_entry_id,
                //entry,catalog_entry.account_id,catalog_entry.paired_account_id,
                //catalog_entry.amount,catalog_entry.amount_calc,catalog_entry.description);
            });

        };
        service.generateScheduleFromCatalog= function(catalog_entry) {
            var schedule;
            if (verbose>=2) console.log("ScheduleFactory.generateScheduleFromCatalog()");

            switch(catalog_entry.frequency) {
                case ConstantsFactory.FREQ_MONTHLY:
                    //TODO: calculate ledger date

                    schedule = CalculationEngine.calculateMonthlyScheduleDate(catalog_entry.frequency_param,
                    catalog_entry.start_date,catalog_entry.end_date,new Date(2016,0,1));

                    break;
                case ConstantsFactory.FREQ_LAST_WEEKDAY_OF_MONTH:
                    schedule = CalculationEngine.calculateLastWeekdayOfMonths(
                    catalog_entry.start_date,catalog_entry.end_date,new Date(2016,0,1));
                    break;
                case ConstantsFactory.FREQ_LAST_DAY_OF_MONTH:
                    schedule = CalculationEngine.calculateLastDayOfMonths(
                    catalog_entry.start_date,catalog_entry.end_date,new Date(2016,0,1));
                    break;
                case ConstantsFactory.FREQ_FIRST_WEEKDAY_OF_MONTH:
                    schedule = CalculationEngine.calculateFirstWeekdayOfMonths(
                    catalog_entry.start_date,catalog_entry.end_date,new Date(2016,0,1));
                    break;
                    

            }
            switch(catalog_entry.catalog_entry_type) {
                case ConstantsFactory.FIXED:
                case ConstantsFactory.TYPE_INTEREST_ON_BALANCE:
                case ConstantsFactory.TYPE_LOAN_PAYMENT:
                    if (verbose>=3) console.log('generate fixed monthly');
                    service.saveFixedSchedule(schedule,catalog_entry);
                    service.runSchedule(); // TODO: delete this
                    break;
            }
        };

        return service;
    })
    .factory('ConstantsFactory', function () {
        var constants = {};
        var verbose = 1;

        init();

        function init() {
            if (verbose>=2) console.log("ConstantsFactory.init()");
            constants.FIRST_USER_ID = 10000;
            constants.FIRST_ACCOUNT_ID = 20000;
            constants.FIRST_CATALOG_ENTRY_ID = 30000;
            constants.FIRST_SCHEDULE_ENTRY_ID = 40000;
            constants.FIRST_JOURNAL_ENTRY_ID = 50000;
            constants.FIRST_FINANCIAL_MODEL_ID = 60000;

            constants.FREQ_MONTHLY = "monthly";
            constants.FREQ_FIRST_DAY_OF_MONTH = "first day each month";
            constants.FREQ_FIRST_WEEKDAY_OF_MONTH = "first weekday each month";
            constants.FREQ_LAST_DAY_OF_MONTH = "last day each month";
            constants.FREQ_LAST_WEEKDAY_OF_MONTH = "last weekday each month";
            constants.FREQ_WEEKLY = "weekly";

            constants.FREQUENCY_LIST = [
                constants.FREQ_MONTHLY,
                constants.FREQ_FIRST_DAY_OF_MONTH,
                constants.FREQ_FIRST_WEEKDAY_OF_MONTH,
                constants.FREQ_LAST_DAY_OF_MONTH,
                constants.FREQ_LAST_WEEKDAY_OF_MONTH,
                constants.FREQ_WEEKLY
            ];

            constants.FIXED = "fixed";
            constants.TYPE_INTEREST_ON_BALANCE = "interest on balance";
            constants.TYPE_LOAN_PAYMENT = "loan payment";
            constants.TYPE_ESCALATING = "fixed escalating";

            constants.TYPE_LIST = [
                constants.FIXED,
                constants.TYPE_INTEREST_ON_BALANCE,
                constants.TYPE_LOAN_PAYMENT,
                constants.TYPE_ESCALATING
            ];

            constants.DEFAULT_RANGE_START = new Date(2016, 1, 1);
            constants.DEFAULT_RANGE_END = new Date(2016, 7, 1);

            constants.OPENING_BALANCE = "Opening Balance";
        }

        return constants;
    })
    .factory('CalculationEngine', function (ConstantsFactory) {
        var verbose = 1;
        var service = {};

        init();

        function init() {
            if (verbose>=2) console.log('CalculationEngine.init()');
        }

        service.calcFirstDayOfMonth = function (date) {
            var _new_date = new Date(date.getFullYear(), date.getMonth(), 1);
            return _new_date;
        };
        service.calcFirstWeekdayOfMonth = function (date) {
            var _draft_date = service.calcFirstDayOfMonth(date);

            var add = 0;

            if (6 == _draft_date.getDay()) {
                add = 2;
            }
            else if (0 == _draft_date.getDay()) {
                add = 1;
            }
            if (add > 0) _draft_date.setDate(_draft_date.getDate() + add);

            return _draft_date;
        };
        service.calcLastDayOfMonth = function (date) {
            var _date = new Date(date.getFullYear(), date.getMonth() + 1, 1); // first day of next month
            _date.setDate(_date.getDate() - 1);

            return _date;
        };
        service.calcLastWeekdayOfMonth = function (date) {
            var d = service.calcLastDayOfMonth(date);
            var subtract = 0;

            if (d.getDay() == 0) subtract = 2; //Sunday
            if (d.getDay() == 6) subtract = 1; //Saturday

            if (subtract > 0) d.setDate(d.getDate() - subtract);
            if (verbose>=3) console.log('(last weekday)' + d.toDateString());

            return d;
        };
        service.addXWeeksTo = function (weeks, date) {
            var d = new Date(date);
            var add = weeks * 7;

            d.setDate(d.getDate() + add);

            return d;
        };
        service.addXMonthsTo = function (months, date) {
            var d = new Date(date);

            d.setMonth(d.getMonth() + months);

            return d;
        };
        service.calculateMonthlyScheduleDate = function (day_of_month, catalog_entry_start_date,
                                                         catalog_entry_end_date, ledger_balance_date) {
            if (verbose>=2) console.log('CalculationEngine.calculateMonthlyScheduleDate()');

            var schedule_dates = [];
            var current_date;

            if (catalog_entry_end_date < ledger_balance_date) {
                return null;
            }
            else {
                // if start date is before opening date..
                if ((catalog_entry_start_date == null) || (catalog_entry_start_date < ledger_balance_date)) {
                    current_date = new Date(ledger_balance_date);
                }
                else {
                    current_date = new Date(catalog_entry_start_date);
                }
                // set day of month
                //console.log('  current_date='+JSON.stringify(current_date));
                if (current_date.getDate() > day_of_month) {
                    // set to next month
                    current_date.setMonth(current_date.getMonth() + 1);
                    current_date.setDate(day_of_month);
                }
                else {
                    current_date.setDate(day_of_month);
                }
                schedule_dates.push(new Date(current_date));
                current_date = service.addXMonthsTo(1, current_date);

                var max_iterations = 20;
                while ((max_iterations-- > 0) && (current_date <= catalog_entry_end_date)) {

                    schedule_dates.push(new Date(current_date));
                    current_date = service.addXMonthsTo(1, current_date);
                }

            }
            return schedule_dates;

        };
        service.getYearMonthText = function(date) {
          var months = [ "Jan", "Feb", "Mar", "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
          
          var result = months[date.getMonth()] + " " + date.getFullYear();
          
          return result;
        }
        // first day
        // first weekday
        // every x weeks
        // weekly
        // biweekly
        service.calculateLastDayOfMonths = function (catalog_entry_start_date,
                                                     catalog_entry_end_date, ledger_balance_date) {
            if (verbose>=2) console.log('CalculationEngine.calculateLastDayOfMonths()');

            var schedule = service.calculateMonthlyScheduleDate(1, catalog_entry_start_date,
                catalog_entry_end_date, ledger_balance_date);

            schedule.forEach(function (d) {
                d.setDate(d.getDate() - 1);
                if (verbose>=3) console.log('(last day)' + d.toDateString());
            });

            return schedule;
        };
        service.calculateLastWeekdayOfMonths = function (catalog_entry_start_date,
                                                         catalog_entry_end_date, ledger_balance_date) {
            if (verbose>=2) console.log('CalculationEngine.calculateLastWeekdayOfMonths()');

            var schedule = service.calculateLastDayOfMonths(catalog_entry_start_date,
                catalog_entry_end_date, ledger_balance_date);

            //TODO: can optimize to just 1 iteration
            schedule.forEach(function (d) {
                var subtract = 0;

                if (d.getDay() == 0) subtract = 2; //Sunday
                if (d.getDay() == 6) subtract = 1; //Saturday

                if (subtract > 0) d.setDate(d.getDate() - subtract);
                if (verbose>=3) console.log('(last weekday)' + d.toDateString());
            });

            return schedule;
        }
        service.calculateFirstWeekdayOfMonths = function (catalog_entry_start_date,
                                                         catalog_entry_end_date, ledger_balance_date) {
            if (verbose>=2) console.log('CalculationEngine.calculateFirstWeekdayOfMonths()');

            var schedule = service.calculateMonthlyScheduleDate(1, catalog_entry_start_date,
                catalog_entry_end_date, ledger_balance_date);
            var new_schedule = [];

            //TODO: can optimize to just 1 iteration
            schedule.forEach(function (d) {
                new_schedule.push( service.calcFirstWeekdayOfMonth(d));
                //if (verbose) console.log('(last weekday)' + d.toDateString());
            });
            if (verbose>=3) console.log('first weekday schedule: '+JSON.stringify(new_schedule));
            return new_schedule;
        }
        return service;
    })
    .factory('UserFactory', function (ConstantsFactory) {
        var verbose = 1;
        var users = [];
        var service = {};
        var next_user_id;
        // TODO: modify for dynamic user administration


        init();

        function init() {
            if (verbose>=2) console.log("UserFactory.init()");
            next_user_id = ConstantsFactory.FIRST_USER_ID;
        };
        service.getCurrentUser = function() {
            return 5000;
        };
        service.addUser = function (name) {
            if (verbose>=2) console.log('UserFactory.addUser()');

            var new_user = {
                user_id: next_user_id++,
                name: name
            };

            users.push(new_user);

            return new_user.user_id;
        };
        service.getUserCount = function () {
            return users.length;
        };
        service.getUserList = function () {
            return users;
        };
        return service;

    });
