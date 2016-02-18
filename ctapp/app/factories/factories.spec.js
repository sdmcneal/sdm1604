describe("fsApp.common.models::LedgerFactory", function () {
    beforeEach(module('fsApp.common.models'));

    //var constants_factory = {
    //    FIRST_ACCOUNT_ID: 10000
    //};

    beforeEach(inject(function (ConstantsFactory) {
        constants_factory = ConstantsFactory;

    }));
    var ledger_factory;

    beforeEach(inject(function ($injector) {
        //beforeEach(module('fsApp.common.models'));
        ledger_factory = $injector.get('LedgerFactory');
    }));

    it("first id should be initialized", function () {
        //var l = ledger_factory.getAccountCount();
        //expect(l).toEqual(0);
        expect(ledger_factory.getNextAccountID()).toEqual(constants_factory.FIRST_ACCOUNT_ID);
    });

    describe("add new account, ledger, and opening balance", function () {
        var balance_date, checking_id, account_count, first_account, ledger_count, ledger;

        beforeAll(function () {
            console.log('beforeAll()');
            balance_date = new Date(2016, 1, 2);
            checking_id = ledger_factory.addAccount("Checking", "Liquid", 1000.0, balance_date);
            account_count = ledger_factory.getAccountCount();
            first_account = ledger_factory.getAccountList()[0];
            ledger_count = ledger_factory.getLedgerCount();
            ledger = ledger_factory.getLedger(checking_id);

        });
        it("successfully adds new account", function () {
            expect(account_count).toEqual(1);
            expect(checking_id).toEqual(constants_factory.FIRST_ACCOUNT_ID);
            expect(first_account.name).toEqual("Checking");
            expect(first_account.balance).toEqual(1000.0);
            expect(first_account.balance_date).toEqual(balance_date);
        });
        it("successfully add new ledger and JE", function () {
            expect(ledger_count).toEqual(1);
            expect(ledger.journal_entry_id).toEqual(constants_factory.FIRST_JOURNAL_ENTRY_ID);
            expect(ledger.journal_entry_date).toEqual(balance_date);
            expect(ledger.description).toEqual(constants_factory.OPENING_BALANCE);
            expect(ledger.amount).toEqual(1000.0);
        })
    });

});

describe("Common models", function () {
    beforeEach(function () {
        module('fsApp.common.models');
    });

    var constants_factory;
    var calculation_engine;

    beforeEach(inject(function (_ConstantsFactory_, CalculationEngine) {
        constants_factory = _ConstantsFactory_;
        calculation_engine = CalculationEngine;

    }));

    it("user id start should be 10000", function () {
        expect(constants_factory.FIRST_USER_ID).toEqual(10000);
    });

    it("another one", function () {
        expect(constants_factory.FIRST_ACCOUNT_ID).toEqual(20000);
    });

    describe("Date calculations", function () {
        it("should return first day in month", function () {
            var d1 = new Date(2016, 5, 5), e1 = new Date(2016, 5, 1);

            // include negative test?
            expect(calculation_engine.calcFirstDayOfMonth(d1)).toEqual(e1);
        });
        it("when first day is saturday, it should return +2 days (3rd)", function () {
            expect(calculation_engine.calcFirstWeekdayOfMonth(new Date(2017, 3, 5))).toEqual(
                new Date(2017, 3, 3));
        });
        it("when first day is Sunday, it should return +1 day (2nd)", function () {
            expect(calculation_engine.calcFirstWeekdayOfMonth(new Date(2016, 4, 5))).toEqual(
                new Date(2016, 4, 2));
        });

    });
    describe("Last day calculations", function () {
        it("in any month pre-december, should return last day", function () {
            var d1 = new Date(2016, 3, 12);
            var e1 = new Date(2016, 3, 30);

            expect(calculation_engine.calcLastDayOfMonth(d1)).toEqual(e1);
        });
        it("in any month pre-december, should return last day", function () {
            var d1 = new Date(2016, 11, 12);
            var e1 = new Date(2016, 11, 31);

            expect(calculation_engine.calcLastDayOfMonth(d1)).toEqual(e1);
        });
        it("in month ending on Saturday, should return -1 day", function () {
            var d1 = new Date(2016, 3, 30);
            var e1 = new Date(2016, 3, 29);

            expect(calculation_engine.calcLastWeekdayOfMonth(d1)).toEqual(e1);
        });
        it("in month ending on Sunday, should return -2 days", function () {
            var d1 = new Date(2016, 6, 28);
            var e1 = new Date(2016, 6, 29);

            expect(calculation_engine.calcLastWeekdayOfMonth(d1)).toEqual(e1);
        });
    });
    describe("Add fixed units to dates", function () {
        it("add 1 week", function () {
            var d1 = new Date(2016, 0, 13);
            var e1 = new Date(2016, 0, 20);

            expect(calculation_engine.addXWeeksTo(1, d1)).toEqual(e1);
        });
        it("add 7 weeks", function () {
            var d1 = new Date(2016, 11, 13);
            var e1 = new Date(2017, 0, 31);

            expect(calculation_engine.addXWeeksTo(7, d1)).toEqual(e1);
        });
        it("add 1 month", function () {
            var d1 = new Date(2016, 0, 13);
            var e1 = new Date(2016, 1, 13);

            expect(calculation_engine.addXMonthsTo(1, d1)).toEqual(e1);
        });
        it("add 3 months over year end point", function () {
            var d1 = new Date(2016, 11, 13);
            var e1 = new Date(2017, 2, 13);

            expect(calculation_engine.addXMonthsTo(3, d1)).toEqual(e1);
        });
    });

});