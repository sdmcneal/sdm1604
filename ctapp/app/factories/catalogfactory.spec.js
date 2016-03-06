xdescribe("fsApp.common.models::CatalogFactory", function () {
    beforeEach(module('fsApp.common.models'));

    var constants_factory;
    var catalog_factory;

    beforeEach(inject(function ($injector) {
        constants_factory = $injector.get('ConstantsFactory');
        catalog_factory = $injector.get('CatalogFactory');

    }));
    it("factories defined", function () {
        expect(constants_factory).toBeDefined();
        expect(catalog_factory).toBeDefined();
    });

    var new_catalog_entry_form;

    beforeAll(function () {
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

    describe("catalog manipulation", function () {
        it("add entry", function () {
            expect(constants_factory).toBeDefined();
            catalog_factory.addCatalogEntry(new_catalog_entry_form);
            expect(catalog_factory.getCatalogEntryCount()).toEqual(1);
        });
    });

});
