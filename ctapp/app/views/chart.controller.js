'use strict';

angular.module('fsApp.views.chart', ['fsApp.common.models'])
.factory('chartService', function($rootScope) {
    var service = {};
    
    service.chart = '';
    
    service.setChart = function(chart) {
        service.chart = chart;
    }
    service.addSeries = function (series) {
        service.chart.addSeries(series);
    }
    return service;
})
    .directive('hcChart', function (chartService) {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                options: '='
            },
            link: function (scope, element) {
                init();
                
                function init() {
                    var defaultOptions = {
                        chart: { renderTo: element[0] }
                    };
                    var config = angular.extend(defaultOptions,scope.options);
                    chartService.setChart( new Highcharts.chart(config) );
                }
                
                scope.$watch("config.series", function(loading) {
                    console.log('watch()'+JSON.stringify(scope.options));
                    //chart.addSeries({ name: 'Account 2', data: [300,200,250]});
                });
                
            }
        };
    })
    
    .controller('ChartController', function ($scope,LedgerFactory,chartService,
    CalculationEngine) {
        $scope.thelabels = ['Jan','Feb','Mar'];
        $scope.thedata= [100,200,150];
        $scope.time_scales = [];
        
        
        init();
        
        
        $scope.setTheTimeScale = function(id) {
            $scope.current_time_scale = id;
            $scope.time_scales.forEach(function(s) {
                if (s.id==id) {
                    $scope.start_date = s.start_date;
                    $scope.end_date = s.end_date;
                }
            });
        };
        function init() {
            var today = new Date();
            var start_of_month = new Date(today.getFullYear(),today.getDate(),1);
            $scope.time_scales = [{
                id: 1,
                description: "1 Month",
                start_date: today,
                end_date: CalculationEngine.addXMonthsTo(1,today)
            },
            {
                id: 2,
                description: "1 Year",
                start_date: today,
                end_date: CalculationEngine.addXMonthsTo(12,today)
            },
            {
                id: 3,
                description: "10 Years",
                start_date: today,
                end_date: CalculationEngine.addXMonthsTo(120,today)
            }];
            
           // $scope.setTheTimeScale(2);
        }
        $scope.drawLedger = function() {
            console.log('drawLedger()');
            var accounts = LedgerFactory.getAccountList();
            
            var result = LedgerFactory.getMonthEndBalances(accounts[0].account_id,
            $scope.start_date,$scope.end_date);
            
            chartService.addSeries({ name: 'Account 2', data: result.data});
            
            //$scope.chartOptions.series = [{ name: 'Account 2', data: [300,200,250]}];
            console.log('chartOptions='+JSON.stringify($scope.chartOptions));
        };
        // Sample options for first chart
        $scope.chartOptions = {
            title: {
                text: 'Temperature data'
            },
            xAxis: {
                categories: $scope.thelabels
            },

            series: [{
                name: 'Account 1',
                data: $scope.thedata
            }]
        };

        
    });