xdescribe('FinancialModelController', function() {
    beforeEach(module('fsApp.views.FinancialModel'));

    var $controller;
    var controller;
    var $scope = {};

    beforeEach(inject(function(_$controller_) {
        $controller = _$controller_;

        controller = $controller('FinancialModelController', {
            $scope: $scope
        });
    }));

    describe('financial models', function() {
        it('should save a model', function() {
            $scope.user_id=5000;
            $scope.financial_form = {
                model_id: 1234,
                model_name: "jasmine model 1",
                create_date: new Date(),
                user_id: 5000,
                active_flag: true
            };
            $scope.createFinancialModel();
            var results =$scope.getAllFinancialModels(); 
            expect(results.length).toEqual(1);
        })
    });
})