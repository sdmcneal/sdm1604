describe('fsApp.common.models.FinancialModelFactory', function() {
    beforeEach(module('fsApp.common.models'));

    var constants_factory;
    var financial_model_factory;
    var user_factory;

    beforeEach(inject(function($injector) {
       constants_factory = $injector.get('ConstantsFactory');
        financial_model_factory = $injector.get('FinancialModelFactory');
        user_factory = $injector.get('UserFactory');
    }));

    describe('handle model CRUD operations', function() {
        it('should add model with first id with only name passed', function() {
            var first_id = constants_factory.FIRST_FINANCIAL_MODEL_ID;

            var model_id = financial_model_factory.createFinancialModel({
                model_name: "karma model 1"
            });

            var model = financial_model_factory.getFinancialModel(model_id);
            expect(model.user_id).toEqual(user_factory.getCurrentUser());
            expect(model.model_id).toEqual(first_id);
            expect(model.active_flag).toEqual(true);

        });
        it('should add model with first id with existing model id and active flag', function() {
            var first_id = constants_factory.FIRST_FINANCIAL_MODEL_ID;

            var model_id = financial_model_factory.createFinancialModel({
                model_name: "karma model 1",
                model_id: 7890,
                active_flag: false
            });

            var model = financial_model_factory.getFinancialModel(model_id);
            expect(model.user_id).toEqual(user_factory.getCurrentUser());
            expect(model.model_id).toEqual(7890);
            expect(model.active_flag).toEqual(false);

        });
    });

});