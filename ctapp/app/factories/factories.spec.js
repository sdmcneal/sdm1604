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
        it("when first day is saturday, it should return +2 days (3rd)", function() {
            expect(calculation_engine.calcFirstWeekdayOfMonth(new Date(2017,3,5))).toEqual(
                new Date(2017,3,3));
        });
        it("when first day is Sunday, it should return +1 day (2nd)", function() {
            expect(calculation_engine.calcFirstWeekdayOfMonth(new Date(2016,4,5))).toEqual(
                new Date(2016,4,2));
        });

    });
    describe("Last day calculations", function() {
        it("in any month pre-december, should return last day", function () {
            var d1 = new Date(2016,3,12);
            var e1 = new Date(2016,3,30);

            expect(calculation_engine.calcLastDayOfMonth(d1)).toEqual(e1);
        });
        it("in any month pre-december, should return last day", function () {
            var d1 = new Date(2016,11,12);
            var e1 = new Date(2016,11,31);

            expect(calculation_engine.calcLastDayOfMonth(d1)).toEqual(e1);
        });
        it("in month ending on Saturday, should return -1 day", function () {
            var d1 = new Date(2016,3,30);
            var e1 = new Date(2016,3,29);

            expect(calculation_engine.calcLastWeekdayOfMonth(d1)).toEqual(e1);
        });
        it("in month ending on Sunday, should return -2 days", function () {
            var d1 = new Date(2016,6,28);
            var e1 = new Date(2016,6,29);

            expect(calculation_engine.calcLastWeekdayOfMonth(d1)).toEqual(e1);
        });
    });
    describe("Add fixed units to dates", function() {
        it("add 1 week", function () {
            var d1 = new Date(2016,0,13);
            var e1 = new Date(2016,0,20);

            expect(calculation_engine.addXWeeksTo(1,d1)).toEqual(e1);
        });
        it("add 7 weeks", function () {
            var d1 = new Date(2016,11,13);
            var e1 = new Date(2017,0,31);

            expect(calculation_engine.addXWeeksTo(7,d1)).toEqual(e1);
        });
    });

});