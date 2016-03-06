describe("fsApp.common.models::LedgerFactory", function () {
    beforeEach(function () {
        module('fsApp.common.models');
        module('fsApp.common.factories.Ledger');
    });

    var constants_factory;
    var ledger_factory;
    var catalog_factory;
    var schedule_factory;

    beforeEach(inject(function ($injector) {
        //beforeEach(module('fsApp.common.models'));
        constants_factory = $injector.get('ConstantsFactory');
        ledger_factory = $injector.get('LedgerFactory');
        catalog_factory = $injector.get('CatalogFactory');
        schedule_factory = $injector.get('ScheduleFactory');
    }));

    it("first id should be initialized", function () {
        //var l = ledger_factory.getAccountCount();
        //expect(l).toEqual(0);
        expect(ledger_factory).toBeDefined();
    });

    describe("add new account, ledger, and opening balance", function () {
        var form,balance_date, checking_id, account_count, first_account, ledger_count, journal_entries;

        beforeEach(function () {
            //console.log('beforeAll()');
            balance_date = new Date(2016, 1, 2);
            form = {
                name: "jasmine account 1",
                type: "cash",
                balance: 1000.0,
                balance_date: balance_date,
                _id: "reallylonghexdemical"
            };
            checking_id = ledger_factory.addAccount(form);
            account_count = ledger_factory.getAccountCount();
            first_account = ledger_factory.getAccountList()[0];
            ledger_count = ledger_factory.getLedgerCount();
            journal_entries = ledger_factory.getJournalEntries(checking_id);
            //console.log('ledger_count: ' + ledger_count);

        });
        it("successfully adds new account", function () {
            expect(account_count).toEqual(1);
            expect(checking_id).toEqual(form._id);
            expect(first_account.name).toEqual(form.name);
            expect(first_account.balance).toEqual(1000.0);
            expect(first_account.balance_date).toEqual(balance_date);
            //console.log('ledger_count: ' + ledger_count);
            //console.log('first journal: ' + JSON.stringify(journal_entries[0]));
        });
        it("successfully add new ledger and JE", function () {
            expect(ledger_count).toEqual(1);
            expect(journal_entries[0].journal_entry_id).toEqual(constants_factory.FIRST_JOURNAL_ENTRY_ID);
            expect(journal_entries[0].journal_entry_date).toEqual(balance_date);
            expect(journal_entries[0].description).toEqual(constants_factory.OPENING_BALANCE);
            expect(journal_entries[0].amount).toEqual(1000.0);
            console.log('ledger_count: ' + ledger_count);
        });
        it("returns account details", function() {
            var r = ledger_factory.getAccountDetails(form._id);
            expect(r.name).toEqual(form.name);
        });
        it("updates accounts correctly", function() {
            var a = {
                _id: form._id,
                name: "account 2",
                type: "cash",
                balance: 1001.0,
                balance_date: balance_date
            };
            ledger_factory.updateAccount(a._id, a.name, a.type, a.balance, a.balance_date);
            var b = ledger_factory.getAccountDetails(a._id);
            expect(b.name).toEqual(a.name);
            expect(b.balance).toEqual(a.balance);
        });
        it("purges scheduled entries",function() {
            ledger_factory.addJournalEntry(form._id,new Date(),555,"scheduled",100.0);
            expect(ledger_factory.getJournalEntries(form._id).length).toEqual(2);
            ledger_factory.resetLedgers();
            expect(ledger_factory.getJournalEntries(form._id).length).toEqual(1);
        });
        it("gets last balance", function() {
            var b = ledger_factory.getLastBalance(form._id);
            expect(b).toEqual(form.balance);
        });
    });
    xdescribe("purge scheduled ledgers", function () {
        it("remove scheduled entries", function () {
            var account_id = ledger_factory.addAccount("account1", "cash", 1000.0, new Date());
            expect(ledger_factory.getJournalEntries(account_id).length).toEqual(1);
            ledger_factory.addJournalEntry(account_id, new Date(), 1, "1 with schedule", 10.0);
            ledger_factory.addJournalEntry(account_id, new Date(), null, "2 without schedule", 20.0);
            ledger_factory.addJournalEntry(account_id, new Date(), 3, "1 with schedule", 30.0);
            var ledger = ledger_factory.getJournalEntries(account_id);
            //console.log('before JEs: '+JSON.stringify(ledger));
            var start_length = ledger.length;
            expect(ledger.length).toEqual(4);
            ledger_factory.resetLedgers();
            ledger = ledger_factory.getJournalEntries(account_id);
            //console.log('after JEs: '+JSON.stringify(ledger));
            expect(ledger.length).toEqual(start_length - 2);
            expect(ledger[ledger.length - 1].amount).toEqual(20.0);
        });
    });
    xdescribe("getLastBalance()", function () {
        it("calculates last balance", function () {
            var account_id = ledger_factory.addAccount("account1", "cash", 1000.0, new Date());
            ledger_factory.addJournalEntry(account_id, new Date(), 1, "1 with schedule", 10.0);
            ledger_factory.addJournalEntry(account_id, new Date(), null, "2 without schedule", 20.0);
            ledger_factory.addJournalEntry(account_id, new Date(), 3, "1 with schedule", 30.0);
            var last_balance = ledger_factory.getLastBalance(account_id);
            expect(last_balance).toEqual(1000.0 + 10.0 + 20.0 + 30.0);
        });
    });
    xdescribe("runSchedule()", function () {
        it("calculates interest", function () {
            var account_id = ledger_factory.addAccount("account1", "cash", 1000.0, new Date(2016, 1, 1));
            //ledger_factory.addJournalEntry(account_id, new Date(2016,1,2), 1, "1 with schedule", 2000.0);
            new_catalog_entry_form = {

                parent_catalog_entry_id: null,
                account_id: account_id,
                catalog_entry_type: constants_factory.TYPE_INTEREST_ON_BALANCE,
                description: "first entry",
                frequency: "monthly", //constants_factory.FREQ_MONTHLY,
                frequency_param: 15,
                amount: 0.0,
                amount_calc: 0.01,
                param1: "param1",
                param2: "param2",
                tax_year_maximum: 99999.99,
                start_date: new Date(2016, 1, 20),
                end_date: new Date(2016, 11, 31)
            };
            //catalog_factory.addCatalogEntry(new_catalog_entry_form);
            schedule_factory.generateScheduleFromCatalog(new_catalog_entry_form);
            var ledgers = ledger_factory.getJournalEntries(account_id);
            var balance_after_first_calc = ledgers[2].balance;
            console.log('  journals=' + JSON.stringify(ledgers));
            expect(balance_after_first_calc).toEqual(1000.0 * 1.01 * 1.01);
        });
    });
    xdescribe("getMonthEndBalances()", function() {
        var balance_date, checking_id, range_start, range_end, result;

        beforeEach(function () {
            console.log('beforeEach()');
            balance_date = new Date(2016, 1, 2);
            checking_id = ledger_factory.addAccount(
                {
                    name: "Checking",
                    type: "Liquid",
                    balance: 1000.0,
                    balance_date: balance_date
                });
            range_start = new Date(2016,1,2);
            range_end = new Date(2016,5,2);
            ledger_factory.addJournalEntry(checking_id,new Date(2016,1,18),1,"Feb entry",100.0);
            ledger_factory.addJournalEntry(checking_id,new Date(2016,2,18),1,"Mar entry",100.0);
            ledger_factory.addJournalEntry(checking_id,new Date(2016,3,18),1,"Apr entry",100.0);
            ledger_factory.addJournalEntry(checking_id,new Date(2016,4,18),1,"May entry",100.0);
            result = ledger_factory.getMonthEndBalances(checking_id,range_start,range_end);
        });
        it("should have 4 month end results", function() {
            expect(result.labels.length).toEqual(4);
        });
        it("should have last entry as 1400", function() {
            expect(result.data[3]).toEqual(1400);
        });
        it("should not error with period with no journal entries", function() {
            range_end = new Date(2016,8,2);
            result = ledger_factory.getMonthEndBalances(checking_id,range_start,range_end);
            expect(result.labels.length).toEqual(7);
            expect(result.data[6]).toEqual(1400);
        });
    });
});
