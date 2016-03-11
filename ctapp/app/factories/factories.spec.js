
xdescribe("fsApp.common.models::ScheduleFactory", function () {
    beforeEach(module('fsApp.common.models'));

    var constants_factory;
    var ledger_factory;
    var catalog_factory;
    var schedule_factory;
    var calculation_factory;

    beforeEach(inject(function ($injector) {
        //beforeEach(module('fsApp.common.models'));
        constants_factory = $injector.get('ConstantsFactory');
        ledger_factory = $injector.get('LedgerFactory');
        catalog_factory = $injector.get('CatalogFactory');
        schedule_factory = $injector.get('ScheduleFactory');
    }));
    it("factories defined", function () {
        expect(constants_factory).toBeDefined();
        expect(catalog_factory).toBeDefined();
        expect(ledger_factory).toBeDefined();
    });

    describe("generateJournalEntriesForLoanPayment()", function () {
        var checking_id, loan_id, schedule_form, start_date, end_date, loan_payment, monthly_interest,
            schedule_id,new_schedule_entry;

        beforeEach(function () {
            checking_id = ledger_factory.addAccount("Checking", "Liquid", 5000.0, new Date(2016, 0, 1));
            loan_id = ledger_factory.addAccount("Car Loan", "Liability", -20000.0, new Date(2016, 0, 1));
            start_date = new Date(2016, 0, 15);
            end_date = new Date(2016, 2, 15);
            loan_payment = -500.0;
            monthly_interest = 0.005; // 6%
            schedule_id = 4300;

            schedule_form = {
                account_id: checking_id,
                paired_account_id: loan_id,
                frequency: constants_factory.FREQ_MONTHLY,
                frequency_param: 15,
                catalog_entry_type: constants_factory.TYPE_LOAN_PAYMENT,
                amount: loan_payment,
                amount_calc: monthly_interest,
                description: "car payment",
                schedule_id: schedule_id,
                start_date: start_date,
                end_date: end_date
            };
            new_schedule_entry = {
                schedule_entry_id: 5300,
                catalog_entry_id: 6300,
                catalog_entry_type: schedule_form.catalog_entry_type,
                schedule_date: new Date(2016,0,15),
                account_id: schedule_form.account_id,
                paired_account_id: schedule_form.paired_account_id,
                amount: schedule_form.amount,
                amount_calc: schedule_form.amount_calc,
                description: schedule_form.description
            };

            
        });
        describe("single journal", function() {
            var checking_ledger, loan_ledger;
            beforeEach(function() {
                schedule_factory.generateJournalEntriesForLoanPayment(new_schedule_entry);   
                checking_ledger = ledger_factory.getJournalEntries(checking_id);
                loan_ledger = ledger_factory.getJournalEntries(loan_id);
                
                
            });
            it("accounts defined", function () {
                expect(ledger_factory.getLedgerCount()).toEqual(2);
                expect(checking_ledger.length).toEqual(2);
                expect(loan_ledger.length).toEqual(3);
            });
            it("check interest calculation", function() {
                expect(checking_ledger[1].amount).toEqual(loan_payment);
                var interest_amount = -monthly_interest * 20000;
                expect(loan_ledger[1].amount).toEqual(interest_amount);
            });
        });
         describe("schedule loan journal entries", function() {
            var checking_ledger, loan_ledger;
            beforeEach(function() {
                catalog_factory.addCatalogEntry(schedule_form);
                checking_ledger = ledger_factory.getJournalEntries(checking_id);
                loan_ledger = ledger_factory.getJournalEntries(loan_id);
            });
            it("accounts defined", function () {
                expect(ledger_factory.getLedgerCount()).toEqual(2);
                expect(checking_ledger.length).toEqual(4);
                expect(loan_ledger.length).toEqual(7);
            });
           
        });
        
        

    });

});


describe("Common models", function () {
    beforeEach(function () {
        module('fsApp.common.models');
        module('fsApp.common.factories.Ledger');
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

    it('should return the right month and year text string', function() {
        var date = new Date(2016,1,13);
        
        expect(calculation_engine.getYearMonthText(date)).toEqual("Feb 2016");
    })
    describe('calculateWeeklyScheduleDate()', function() {
       var schedule, schedule3; 
       
       beforeAll(function() {
        schedule = calculation_engine.calculateWeeklyScheduleDate(1,
        new Date(2016,0,7),new Date(2016,0,29),new Date(2016,0,7));
        
        schedule3 = calculation_engine.calculateWeeklyScheduleDate(3,
        new Date(2016,0,7),new Date(2016,2,29),new Date(2016,0,7));
        
       });
       it('should return weekly schedule', function() {
           expect(schedule.length).toEqual(4);
           expect(schedule[0]).toEqual(new Date(2016,0,7));
           expect(schedule[2]).toEqual(new Date(2016,0,21));
       });
       it('should return weekly schedule for 3 weeks', function() {
           expect(schedule3.length).toEqual(4);
           expect(schedule3[0]).toEqual(new Date(2016,0,7));
           expect(schedule3[2]).toEqual(new Date(2016,1,18));
       });
       
    });
    xdescribe("Date calculations", function () {
        it("should return first day in month", function () {
            var d1 = new Date(2016, 5, 5),
                e1 = new Date(2016, 5, 1);

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
    xdescribe("Last day calculations", function () {
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
    xdescribe("Add fixed units to dates", function () {
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
    describe("monthly schedule calculation", function () {
        it("schedule monthly", function () {
            var schedule = calculation_engine.calculateMonthlyScheduleDate(11, new Date(2016, 0, 11),
                new Date(2016, 9, 12), new Date(2016, 0, 5));

            expect(schedule[0]).toEqual(new Date(2016, 0, 11));
            expect(schedule.length).toEqual(10);
            expect(schedule[schedule.length - 1]).toEqual(new Date(2016, 9, 11));
        });
        it("schedule first weekday", function () {
            var schedule = calculation_engine.calculateFirstWeekdayOfMonths(new Date(2016, 0, 11),
                new Date(2016, 9, 12), new Date(2016, 0, 5));

            expect(schedule[0]).toEqual(new Date(2016, 1, 1));
            expect(schedule[3]).toEqual(new Date(2016, 4, 2));
            expect(schedule[8]).toEqual(new Date(2016, 9, 3));
            expect(schedule.length).toEqual(9);

        });
        it("schedule last weekday", function () {
            var schedule = calculation_engine.calculateLastWeekdayOfMonths(new Date(2016, 0, 11),
                new Date(2016, 9, 12), new Date(2016, 0, 5));

            expect(schedule[0]).toEqual(new Date(2016, 0, 29));
            expect(schedule[3]).toEqual(new Date(2016, 3, 29));
            expect(schedule[6]).toEqual(new Date(2016, 6, 29));
            expect(schedule.length).toEqual(9);

        });

    });
    
});