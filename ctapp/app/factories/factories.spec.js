xdescribe("fsApp.common.models::CatalogFactory", function() {
    beforeEach(module('fsApp.common.models'));

    var constants_factory;
    var catalog_factory;

    beforeEach(inject(function($injector) {
        constants_factory = $injector.get('ConstantsFactory');
        catalog_factory = $injector.get('CatalogFactory');

    }));
    it("factories defined", function() {
        expect(constants_factory).toBeDefined();
        expect(catalog_factory).toBeDefined();
    });

    var new_catalog_entry_form;

    beforeAll(function() {
        new_catalog_entry_form = {

            parent_catalog_entry_id: null,
            account_id: 1000,
            catalog_entry_type: "fixed", //constants_factory.FIXED,
            description: "first entry",
            frequency: "monthly", //constants_factory.FREQ_MONTHLY,
            frequency_param: 15,
            amount: 1200.0,
            param1: "param1",
            param2: "param2",
            tax_year_maximum: 99999.99,
            start_date: new Date(2016, 0, 15),
            end_date: new Date(2016, 11, 31)
        };
    });

    describe("catalog manipulation", function() {
        it("add entry", function() {
            expect(constants_factory).toBeDefined();
            catalog_factory.addCatalogEntry(new_catalog_entry_form);
            expect(catalog_factory.getCatalogEntryCount()).toEqual(1);
        });
    });

});

xdescribe("fsApp.common.models::LedgerFactory", function() {
    beforeEach(module('fsApp.common.models'));

    var constants_factory;
    var ledger_factory;

    beforeEach(inject(function($injector) {
        //beforeEach(module('fsApp.common.models'));
        constants_factory = $injector.get('ConstantsFactory');
        ledger_factory = $injector.get('LedgerFactory');
    }));

    it("first id should be initialized", function() {
        //var l = ledger_factory.getAccountCount();
        //expect(l).toEqual(0);
        expect(ledger_factory.getNextAccountID()).toEqual(constants_factory.FIRST_ACCOUNT_ID);
    });

    describe("add new account, ledger, and opening balance", function() {
        var balance_date, checking_id, account_count, first_account, ledger_count, journal_entries;

        beforeAll(function() {
            console.log('beforeAll()');
            balance_date = new Date(2016, 1, 2);
            checking_id = ledger_factory.addAccount("Checking", "Liquid", 1000.0, balance_date);
            account_count = ledger_factory.getAccountCount();
            first_account = ledger_factory.getAccountList()[0];
            ledger_count = ledger_factory.getLedgerCount();
            journal_entries = ledger_factory.getJournalEntries(checking_id);
            console.log('ledger_count: ' + ledger_count);

        });
        it("successfully adds new account", function() {
            expect(account_count).toEqual(1);
            expect(checking_id).toEqual(constants_factory.FIRST_ACCOUNT_ID);
            expect(first_account.name).toEqual("Checking");
            expect(first_account.balance).toEqual(1000.0);
            expect(first_account.balance_date).toEqual(balance_date);
            console.log('ledger_count: ' + ledger_count);
            console.log('first journal: ' + JSON.stringify(journal_entries[0]));
        });
        it("successfully add new ledger and JE", function() {
            expect(ledger_count).toEqual(1);
            expect(journal_entries[0].journal_entry_id).toEqual(constants_factory.FIRST_JOURNAL_ENTRY_ID);
            expect(journal_entries[0].journal_entry_date).toEqual(balance_date);
            expect(journal_entries[0].description).toEqual(constants_factory.OPENING_BALANCE);
            expect(journal_entries[0].amount).toEqual(1000.0);
            console.log('ledger_count: ' + ledger_count);
        })
    });
    describe("purge scheduled ledgers", function() {
        it("remove scheduled entries", function() {
            var account_id = ledger_factory.addAccount("account1", "cash", 1000.0, new Date());
            ledger_factory.addJournalEntry(account_id, new Date(), 1, "1 with schedule", 10.0);
            ledger_factory.addJournalEntry(account_id, new Date(), null, "2 without schedule", 20.0);
            ledger_factory.addJournalEntry(account_id, new Date(), 3, "1 with schedule", 30.0);
            var ledger = ledger_factory.getJournalEntries(account_id);
            expect(ledger.length).toEqual(4);
            ledger_factory.resetLedgers();
            ledger = ledger_factory.getJournalEntries(account_id);
            expect(ledger.length).toEqual(3);
            expect(ledger[ledger.length-1].amount).toEqual(30.0);
        });
    })

});

describe("Common models", function() {
    beforeEach(function() {
        module('fsApp.common.models');
    });

    var constants_factory;
    var calculation_engine;

    beforeEach(inject(function(_ConstantsFactory_, CalculationEngine) {
        constants_factory = _ConstantsFactory_;
        calculation_engine = CalculationEngine;

    }));

    it("user id start should be 10000", function() {
        expect(constants_factory.FIRST_USER_ID).toEqual(10000);
    });

    it("another one", function() {
        expect(constants_factory.FIRST_ACCOUNT_ID).toEqual(20000);
    });

    xdescribe("Date calculations", function() {
        it("should return first day in month", function() {
            var d1 = new Date(2016, 5, 5),
                e1 = new Date(2016, 5, 1);

            // include negative test?
            expect(calculation_engine.calcFirstDayOfMonth(d1)).toEqual(e1);
        });
        it("when first day is saturday, it should return +2 days (3rd)", function() {
            expect(calculation_engine.calcFirstWeekdayOfMonth(new Date(2017, 3, 5))).toEqual(
                new Date(2017, 3, 3));
        });
        it("when first day is Sunday, it should return +1 day (2nd)", function() {
            expect(calculation_engine.calcFirstWeekdayOfMonth(new Date(2016, 4, 5))).toEqual(
                new Date(2016, 4, 2));
        });

    });
    xdescribe("Last day calculations", function() {
        it("in any month pre-december, should return last day", function() {
            var d1 = new Date(2016, 3, 12);
            var e1 = new Date(2016, 3, 30);

            expect(calculation_engine.calcLastDayOfMonth(d1)).toEqual(e1);
        });
        it("in any month pre-december, should return last day", function() {
            var d1 = new Date(2016, 11, 12);
            var e1 = new Date(2016, 11, 31);

            expect(calculation_engine.calcLastDayOfMonth(d1)).toEqual(e1);
        });
        it("in month ending on Saturday, should return -1 day", function() {
            var d1 = new Date(2016, 3, 30);
            var e1 = new Date(2016, 3, 29);

            expect(calculation_engine.calcLastWeekdayOfMonth(d1)).toEqual(e1);
        });
        it("in month ending on Sunday, should return -2 days", function() {
            var d1 = new Date(2016, 6, 28);
            var e1 = new Date(2016, 6, 29);

            expect(calculation_engine.calcLastWeekdayOfMonth(d1)).toEqual(e1);
        });
    });
    xdescribe("Add fixed units to dates", function() {
        it("add 1 week", function() {
            var d1 = new Date(2016, 0, 13);
            var e1 = new Date(2016, 0, 20);

            expect(calculation_engine.addXWeeksTo(1, d1)).toEqual(e1);
        });
        it("add 7 weeks", function() {
            var d1 = new Date(2016, 11, 13);
            var e1 = new Date(2017, 0, 31);

            expect(calculation_engine.addXWeeksTo(7, d1)).toEqual(e1);
        });
        it("add 1 month", function() {
            var d1 = new Date(2016, 0, 13);
            var e1 = new Date(2016, 1, 13);

            expect(calculation_engine.addXMonthsTo(1, d1)).toEqual(e1);
        });
        it("add 3 months over year end point", function() {
            var d1 = new Date(2016, 11, 13);
            var e1 = new Date(2017, 2, 13);

            expect(calculation_engine.addXMonthsTo(3, d1)).toEqual(e1);
        });
    });
    describe("monthly schedule calculation", function() {
        it("schedule monthly", function() {
            var schedule = calculation_engine.calculateMonthlyScheduleDate(11, new Date(2016, 0, 11),
                new Date(2016, 9, 12), new Date(2016, 0, 5));

            expect(schedule[0]).toEqual(new Date(2016, 0, 11));
            expect(schedule.length).toEqual(10);
            expect(schedule[schedule.length - 1]).toEqual(new Date(2016, 9, 11));
        });
        it("schedule first weekday", function() {
            var schedule = calculation_engine.calculateFirstWeekdayOfMonths(new Date(2016, 0, 11),
                new Date(2016, 9, 12), new Date(2016, 0, 5));

            expect(schedule[0]).toEqual(new Date(2016, 1, 1));
            expect(schedule[3]).toEqual(new Date(2016, 4, 2));
            expect(schedule[8]).toEqual(new Date(2016, 9, 3));
            expect(schedule.length).toEqual(9);

        });
        it("schedule last weekday", function() {
            var schedule = calculation_engine.calculateLastWeekdayOfMonths(new Date(2016, 0, 11),
                new Date(2016, 9, 12), new Date(2016, 0, 5));

            expect(schedule[0]).toEqual(new Date(2016, 0, 29));
            expect(schedule[3]).toEqual(new Date(2016, 3, 29));
            expect(schedule[6]).toEqual(new Date(2016, 6, 29));
            expect(schedule.length).toEqual(9);

        });

    });
    describe("schedule to ledger", function() {
        var schedule_factory, ledger_factory, catalog_entry;
        beforeEach(inject(function($injector) {
            schedule_factory = $injector.get('ScheduleFactory');
            ledger_factory = $injector.get('LedgerFactory');
            catalog_factory = $injector.get('CatalogFactory');

        }));
        it("factories defined", function() {
            expect(schedule_factory).toBeDefined();
            expect(ledger_factory).toBeDefined();
        });
        it("schedule fixed catalog entry and open balance", function() {
            var account = ledger_factory.addAccount("Checking", "Cash", 1000.0, new Date(2016, 1, 14));
            expect(account).toBeDefined();

            var ledger = ledger_factory.getJournalEntries(account);
            expect(ledger.length).toEqual(1);

            var je = ledger[0];
            expect(je.balance).toEqual(1000.0);

            catalog_entry = {
                frequency: constants_factory.FREQ_MONTHLY,
                frequency_param: 15,
                catalog_entry_type: constants_factory.FIXED,
                catalog_entry_id: 1201,
                amount: -76.0,
                amount_calc: 0.0,
                account_id: account,
                description: 'first catalog entry',
                start_date: new Date(2016, 1, 12),
                end_date: new Date(2016, 6, 15)
            };

            catalog_factory.addCatalogEntry(catalog_entry);
            expect(catalog_factory.getCatalogEntryCount()).toEqual(1);
            var first_schedule_entry = schedule_factory.getScheduleEntries()[0];
            expect(schedule_factory.getScheduleEntryCount()).toEqual(6);
            expect(first_schedule_entry.amount).toEqual(-76.0);
            console.log('sch[0]=' + JSON.stringify(first_schedule_entry));
            var journal_entries = ledger_factory.getJournalEntries(account);
            expect(journal_entries.length).toEqual(7);
            console.log('je1=' + JSON.stringify(journal_entries[1]));
            expect(journal_entries[1].amount).toEqual(-76.0);
            expect(journal_entries[1].balance).toEqual(1000.0 - 76.0);
        });
        xit("schedule fixed catalog entry at end of month and open balance", function() {
            var account = ledger_factory.addAccount("Checking", "Cash", 1000.0, new Date(2016, 1, 14));
            expect(account).toBeDefined();

            var ledger = ledger_factory.getJournalEntries(account);
            expect(ledger.length).toEqual(1);

            var je = ledger[0];
            expect(je.balance).toEqual(1000.0);

            catalog_entry = {
                frequency: constants_factory.FREQ_LAST_WWEKDAY_OF_MONTH,
                frequency_param: 0,
                catalog_entry_type: constants_factory.FIXED,
                catalog_entry_id: 1201,
                amount: -76.0,
                amount_calc: 0.0,
                account_id: account,
                description: 'first catalog entry',
                start_date: new Date(2016, 1, 12),
                end_date: new Date(2016, 6, 15)
            };

            catalog_factory.addCatalogEntry(catalog_entry);
            expect(catalog_factory.getCatalogEntryCount()).toEqual(1);
            var first_schedule_entry = schedule_factory.getScheduleEntries()[0];
            expect(schedule_factory.getScheduleEntryCount()).toEqual(6);
            expect(first_schedule_entry.amount).toEqual(-76.0);
            //console.log('sch[0]='+JSON.stringify(first_schedule_entry));
            var journal_entries = ledger_factory.getJournalEntries(account);
            expect(journal_entries.length).toEqual(7);
            //console.log('je1='+ JSON.stringify(journal_entries[1]));
            expect(journal_entries[1].amount).toEqual(-76.0);
            expect(journal_entries[1].balance).toEqual(1000.0 - 76.0);
        });
    });
});