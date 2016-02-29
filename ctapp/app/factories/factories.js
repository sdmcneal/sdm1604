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
        var verbose = 1; // 1=error only, 2=init/tracer, 3=debug
        var ledgers = [];
        var accounts = [];
        var account_ids = [];
        var service = {};
        var next_journal_entry_id;
        var next_account_id;

        init();

        function init() {
            if (verbose>=2) console.log('LedgerFactory.init()');
            next_journal_entry_id = ConstantsFactory.FIRST_JOURNAL_ENTRY_ID;
            next_account_id = ConstantsFactory.FIRST_ACCOUNT_ID;
        }

        service.addAccount = function (name, type, balance, balance_date) {
            if (verbose>=2) console.log('LedgerFactory.addAccount()');

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
        service.getAccountDetails = function(account_id) {
            var account;

            if (accounts.length>0) {
                accounts.forEach(function(a) {
                    if (account_id== a.account_id) account = a;
                    console.log(' match');
                });
            }
            return account;
        };
        service.updateAccount = function (account_id,name, type, balance, balance_date) {
            if (verbose>=2) console.log('LedgerFactory.updateAccount()');

            var new_account = {
                account_id: account_id,
                name: name,
                type: type,
                balance: balance,
                balance_date: balance_date
            };

            var i;
            for (i=0;i<accounts.length;i++) {
                if (accounts[i].account_id==account_id) {
                    accounts[i] = new_account;
                    i=accounts.length;
                }
            }

            // update initial balance
            service.updateOpeningBalance(new_account.account_id, balance, balance_date);

            return new_account.account_id;
        };
        service.getAccountCount = function () {
            return accounts.length;
        };
        service.getAccountList = function () {
            return accounts;
        };
        service.addLedger = function (account_id) {
            if (verbose>=2) console.log('LedgerFactory.addLedger()');
            var new_ledger = {
                account_id: account_id,
                journal_entries: []
            };
            ledgers.push(new_ledger);

            account_ids.push(account_id);
        };
        service.resetLedgers = function () {
          var journal_entries;
          var i,l;
          
          for (l=0;l<ledgers.length;l++) {
            var new_journal_entires = [];
            var je;
            for (i=0;i<ledgers[l].journal_entries.length;i++) {
              je = ledgers[l].journal_entries[i];
              if (je.schedule_entry_id==null) new_journal_entires.push(je);
            }
            ledgers[l].journal_entries = new_journal_entires;
          }
        };
        service.addJournalEntry = function (account_id, journal_entry_date,
                                            schedule_entry_id, description, amount) {
            if (verbose>=2) console.log('LedgerFactory.addJournalEntry()');

            var new_journal_entry = {
                journal_entry_id: next_journal_entry_id++,
                journal_entry_date: journal_entry_date,
                schedule_entry_id: schedule_entry_id,
                description: description,
                amount: amount
            };

            var ledger = service.getJournalEntries(account_id);
            var last_balance = 0.0;

            if (ledger.length > 0) {
                last_balance = ledger[ledger.length - 1].balance;
            }
            if (verbose>=3) console.log('Number(amount)='+Number(amount)+' last balance='+Number(last_balance));
            new_journal_entry.balance = last_balance + Number(amount);

            if (verbose>=3) console.log('  logging journal: '+JSON.stringify(new_journal_entry));
            
            ledger.push(new_journal_entry);

            return new_journal_entry.journal_entry_id;
        };
        service.updateOpeningBalance = function(account_id,balance,balance_date) {
            if (verbose>=2) console.log('LedgerFactory.updateOpeningBalance()');
            var l = service.getJournalEntries(account_id);

            l[0].balance = balance;
            l[0].amount = balance;
            l[0].balance_date = balance_date;
        };
        service.getLedgerCount = function () {
            if (verbose>=3) console.log('ledger size='+ledgers.length)
            return ledgers.length;
        };
        service.getNextAccountID = function () {
            return next_account_id;
        };
        service.getJournalEntries = function (account_id) {
            if (verbose>=2) console.log('LedgerFactory.getJournalEntries('+account_id+')');
            var _journal_entries;
            var i;
            var l;

            for (i = 0; i < ledgers.length; i++) {
                l = ledgers[i];
                if (account_id == l.account_id) {
                    _journal_entries = l.journal_entries;
                }
            }
            if (verbose>=3) console.log('  returning journal entries: '+JSON.stringify(_journal_entries));
            return _journal_entries;
        };
        service.getLastBalance = function (account_id) {
            var journal_entries = service.getJournalEntries(account_id);
            if (undefined==journal_entries) {
                if (verbose>=1) console.log('no entries in account '+account_id);
                return 0.0
            } else {
                var count = journal_entries.length;
                if (count == 0) {
                    return 0.0;
                } else {
                    return journal_entries[count - 1].balance;
                }
            }
        };
        service.account_list = account_ids;

        return service;
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
        service.addScheduleEntry = function (catalog_entry_type,catalog_entry_id, schedule_date,
                                             account_id,paired_account_id,amount, amount_calc,description) {

            if (verbose>=2) console.log('ScheduleFactory.addScheduleEntry()');

            var new_schedule_entry = {
                schedule_entry_id: next_schedule_entry_id++,
                catalog_entry_id: catalog_entry_id,
                catalog_entry_type: catalog_entry_type,
                schedule_date: schedule_date,
                account_id: account_id,
                paired_account_id: paired_account_id,
                amount: amount,
                amount_calc: amount_calc,
                description: description
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
                service.addScheduleEntry(catalog_entry.catalog_entry_type,catalog_entry.catalog_entry_id,
                entry,catalog_entry.account_id,catalog_entry.paired_account_id,
                catalog_entry.amount,catalog_entry.amount_calc,catalog_entry.description);
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
            constants.TYPE_LOAN_PAYMENT = "loan payment",
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
                    current_date = ledger_balance_date;
                }
                else {
                    current_date = catalog_entry_start_date;
                }
                // set day of month
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
                catalog_entry_id: next_catalog_entry_id++,
                parent_catalog_entry_id: form.parent_catalog_entry_id,
                account_id: form.account_id,
                paired_account_id: form.paired_account_id,
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
                new_catalog_entry.start_date = form.start_date;
            else
                new_catalog_entry.start_date = new Date();
            if (form.end_date) {
                new_catalog_entry.end_date = form.end_date;
            }
            else {
                new_catalog_entry.end_date = new Date();
                new_catalog_entry.end_date.setFullYear(2100);
            }

            catalog_entries.push(new_catalog_entry);
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

        service.getCatalogEntryCount = function () {
            return catalog_entries.length;
        };

        service.getCatalogEntries = function () {
            return catalog_entries;
        };
        service.setCatalogEntries = function (list) {
          catalog_entries = list;
        };

        return service;
    })

    .factory('AccountFactory', function (ConstantsFactory, LedgerFactory) {
        var verbose = 1;
        var accounts = [];
        var service = {};
        var next_account_id;

        init();

        function init() {
            if (verbose>=2) console.log('AccountFactory.init()');
            next_account_id = ConstantsFactory.FIRST_ACCOUNT_ID;
        }

        service.addAccount = function (name, type, balance, balance_date) {
            if (verbose>=2) console.log('AccountFactory.addAccount()');

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

    .factory('UserFactory', function (ConstantsFactory) {
        var verbose = 1;
        var users = [];
        var service = {};
        var next_user_id;

        init();

        function init() {
            if (verbose>=2) console.log("UserFactory.init()");
            next_user_id = ConstantsFactory.FIRST_USER_ID;
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
