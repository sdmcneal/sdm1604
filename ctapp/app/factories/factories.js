'use strict';

angular.module('fsApp.common.models', [])

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

    .factory('LedgerFactory', function (ConstantsFactory) {
        var verbose = true;
        var ledgers = new Map();
        var account_ids = [];
        var accounts = [];
        var service = {};
        var next_journey_entry_id;
        var next_account_id;

        init();

        function init() {
            if (verbose) console.log('LedgerFactory.init()');
            next_journey_entry_id = ConstantsFactory.FIRST_JOURNAL_ENTRY_ID;
            next_account_id = ConstantsFactory.FIRST_ACCOUNT_ID;
            console.log('next_account_id=' + next_account_id);
        }
        service.getNextAccountID = function() { return next_account_id; };

        service.addLedger = function (account_id) {
            if (verbose) console.log('LedgerFactory.addLedger()');
            ledgers.set(account_id, []);

            account_ids.push(account_id);
        };

        service.addJournalEntry = function (account_id, journal_entry_date,
                                            schedule_entry_id, description, amount) {
            if (verbose) console.log('LedgerFactory.addJournalEntry()');

            var new_journal_entry = {
                journal_entry_id: next_journey_entry_id++,
                journal_entry_date: new Date(journal_entry_date),
                schedule_entry_id: schedule_entry_id,
                description: description,
                amount: amount
            };

            var ledger = service.getLedger(account_id);
            var last_balance = 0.0;

            if (ledger.size > 0) {
                last_balance = ledger[ledger.size - 1].balance;
            }

            new_journal_entry.balance = last_balance + amount;

            ledger.push(new_journal_entry);

            return new_journal_entry.journal_entry_id;
        };

        service.getLedgerCount = function () {
            return ledgers.size;
        };

        service.getLedger = function (account_id) {
            var l = ledgers.get(account_id);
            console.log('get ledger (' + account_id + '): ' + JSON.stringify(l));
            return l;
        };

        service.account_list = account_ids;
        //
        // account management
        //
        service.addAccount = function (name, type, balance, balance_date) {
            if (verbose) console.log('LedgerFactory.addAccount()');

            var new_account = {
                account_id: next_account_id++,
                name: name,
                type: type,
                balance: balance,
                balance_date: balance_date
            };

            accounts.push(new_account);

            service.addLedger(new_account.account_id);

            // add initial balance
            service.addJournalEntry(new_account.account_id, balance_date, null,
                ConstantsFactory.OPENING_BALANCE, balance);

            return new_account.account_id;
        };

        service.getAccountCount = function () {
            return accounts.length;
        };

        service.getAccountList = function () {
            return accounts;
        };

        return service;
    })

    .factory('AccountFactory', function (ConstantsFactory, LedgerFactory) {
        var verbose = true;
        var accounts = [];
        var service = {};
        var next_account_id;

        init();

        function init() {
            if (verbose) console.log('AccountFactory.init()');
            next_account_id = ConstantsFactory.FIRST_ACCOUNT_ID;
        }

        service.addAccount = function (name, type, balance, balance_date) {
            if (verbose) console.log('AccountFactory.addAccount()');

            var new_account = {
                account_id: next_account_id++,
                name: name,
                type: type,
                balance: balance,
                balance_date: balance_date
            };

            accounts.push(new_account);

            LedgerFactory.addLedger(new_account.account_id);

            // add initial balance
            LedgerFactory.addJournalEntry(new_account.account_id, balance_date, null,
                ConstantsFactory.OPENING_BALANCE, balance);

            return new_account.account_id;
        };

        service.getAccountCount = function () {
            return accounts.length;
        };

        service.getAccountList = function () {
            return accounts;
        };

        return service;
    })

    .factory('ScheduleFactory', function (ConstantsFactory) {
        var verbose = true;
        var schedule_entries = [];
        var service = {};
        var next_schedule_entry_id;
        var range_start_date, range_end_date;

        init();

        function init() {
            if (verbose) console.log('ScheduleFactory.init()');
            next_schedule_entry_id = ConstantsFactory.FIRST_SCHEDULE_ENTRY_ID;
            range_start_date = ConstantsFactory.DEFAULT_RANGE_START;
            range_end_date = ConstantsFactory.DEFAULT_RANGE_END;
        }

        service.addScheduleEntry = function (catalog_entry_id, schedule_date,
                                             account_id, amount, amount_calc) {

            if (verbose) console.log('ScheduleFactory.addScheduleEntry()');

            var new_schedule_entry = {
                schedule_entry_id: next_schedule_entry_id++,
                catalog_entry_id: catalog_entry_id,
                schedule_date: schedule_date,
                account_id: account_id,
                amount: amount,
                amount_calc: amount_calc
            };

            schedule_entries.push(new_schedule_entry);


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


        return service;
    })

    .factory('ConstantsFactory', function () {
        var constants = {};
        var verbose = true;

        init();

        function init() {
            if (verbose) console.log("ConstantsFactory.init()");
            constants.FIRST_USER_ID = 10000;
            constants.FIRST_ACCOUNT_ID = 20000;
            constants.FIRST_CATALOG_ENTRY_ID = 30000;
            constants.FIRST_SCHEDULE_ENTRY_ID = 40000;
            constants.FIRST_JOURNAL_ENTRY_ID = 50000;

            constants.FREQ_MONTHLY = "monthly";

            constants.FIXED = "fixed";

            constants.DEFAULT_RANGE_START = new Date(2016, 1, 1);
            constants.DEFAULT_RANGE_END = new Date(2016, 7, 1);

            constants.OPENING_BALANCE = "Opening Balance";
        }

        return constants;
    })

    .factory('CalculationEngine', function (ConstantsFactory) {
        var verbose = true;
        var service = {};

        init();

        function init() {
            if (verbose)console.log('CalculationEngine.init()');
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
            } else if (0 == _draft_date.getDay()) {
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
            if (verbose) console.log('(last weekday)' + d.toDateString());

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
            if (verbose) console.log('CalculationEngine.calculateMonthlyScheduleDate()');

            var schedule_dates = [];
            var current_date;

            if (catalog_entry_end_date < ledger_balance_date) {
                return null;
            } else {
                // if start date is before opening date..
                if ((catalog_entry_start_date == null) || (catalog_entry_start_date < ledger_balance_date)) {
                    current_date = ledger_balance_date;
                } else {
                    current_date = catalog_entry_start_date;
                }
                // set day of month
                if (current_date.getDate() > day_of_month) {
                    // set to next month
                    current_date.setMonth(current_date.getMonth() + 1);
                    current_date.setDate(day_of_month);
                } else {
                    current_date.setDate(day_of_month);
                }
                schedule_dates.push(new Date(current_date));

                var max_iterations = 10;
                while ((max_iterations-- > 0) && (current_date <= catalog_entry_end_date)) {
                    current_date.setMonth(current_date.getMonth() + 1);
                    schedule_dates.push(new Date(current_date));
                }

            }
            return schedule_dates;

        };
        // first day
        // first weekday
        // every x weeks
        // weekly
        // biweekly

        service.calculateLastDayOfMonths = function (catalog_entry_start_date,
                                                     catalog_entry_end_date, ledger_balance_date) {
            if (verbose) console.log('CalculationEngine.calculateLastDayOfMonths()');

            var schedule = service.calculateMonthlyScheduleDate(1, catalog_entry_start_date,
                catalog_entry_end_date, ledger_balance_date);

            schedule.forEach(function (d) {
                d.setDate(d.getDate() - 1);
                if (verbose) console.log('(last day)' + d.toDateString());
            });

            return schedule;
        };

        service.calculateLastWeekdayOfMonths = function (catalog_entry_start_date,
                                                         catalog_entry_end_date, ledger_balance_date) {
            if (verbose) console.log('CalculationEngine.calculateLastWeekdayOfMonths()');

            var schedule = service.calculateLastDayOfMonths(catalog_entry_start_date,
                catalog_entry_end_date, ledger_balance_date);

            //TODO: can optimize to just 1 iteration
            schedule.forEach(function (d) {
                var subtract = 0;

                if (d.getDay() == 0) subtract = 2; //Sunday
                if (d.getDay() == 6) subtract = 1; //Saturday

                if (subtract > 0) d.setDate(d.getDate() - subtract);
                if (verbose) console.log('(last weekday)' + d.toDateString());
            });

            return schedule;
        }

        return service;
    })

    .factory('CatalogFactory', function (ScheduleFactory, ConstantsFactory, CalculationEngine) {
        var verbose = true;
        var catalog_entries = [];
        var service = {};
        var next_catalog_entry_id;

        init();

        function init() {
            if (verbose) console.log('CatalogFactory.init()');
            next_catalog_entry_id = ConstantsFactory.FIRST_CATALOG_ENTRY_ID;
        }

        service.addCatalogEntry = function (description, parent_id, catalog_entry_type, account_id,
                                            paired_account_id, start_date, end_date, amount, frequency,
                                            frequency_param, param1, param2, tax_year_maximum) {

            if (verbose) console.log('CatalogFactory.addCatalogEntry()');

            var new_catalog_entry = {
                catalog_entry_id: next_catalog_entry_id++,
                parent_catalog_entry_id: parent_id,
                account_id: account_id,
                catalog_entry_type: catalog_entry_type,
                description: description,
                frequency: frequency,
                amount: amount,
                param1: param1,
                param2: param2,
                tax_year_maximum: tax_year_maximum
            };
            if (start_date)
                new_catalog_entry.start_date = start_date;
            else
                new_catalog_entry.start_date = new Date();
            if (end_date) {
                new_catalog_entry.end_date = end_date;
            }
            else {
                new_catalog_entry.end_date = new Date();
                new_catalog_entry.end_date.setFullYear(2100);
            }

            catalog_entries.push(new_catalog_entry);

            //
            // TODO: placeholder to test create schedule
            //
            var schedule = CalculationEngine.calculateMonthlyScheduleDate(1, new Date(2016, 0, 12),
                new Date(2100, 0, 1), new Date(2016, 1, 14));

            schedule = CalculationEngine.calculateLastDayOfMonths(new Date(2016, 0, 12),
                new Date(2100, 0, 1), new Date(2016, 1, 14));

            schedule = CalculationEngine.calculateLastWeekdayOfMonths(new Date(2016, 0, 12),
                new Date(2100, 0, 1), new Date(2016, 1, 14));

            //schedule.forEach(function(d) {
            //    d.setDate(d.getDate()-1);
            //    console.log(d.toDateString());
            //});
            //
            //console.log(JSON.stringify(schedule));

            ScheduleFactory.addScheduleEntry(new_catalog_entry.catalog_entry_id, new_catalog_entry.start_date,
                account_id, amount, new_catalog_entry.amountamount_calc);

            return new_catalog_entry.catalog_entry_id;
        };

        service.getCatalogEntryCount = function () {
            return catalog_entries.length;
        };

        service.getCatalogEntries = function () {
            return catalog_entries;
        };

        return service;
    })


    .factory('UserFactory', function (ConstantsFactory) {
        var verbose = true;
        var users = [];
        var service = {};
        var next_user_id;

        init();

        function init() {
            if (verbose) console.log("UserFactory.init()");
            next_user_id = ConstantsFactory.FIRST_USER_ID;
        };

        service.addUser = function (name) {
            if (verbose) console.log('UserFactory.addUser()');

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

