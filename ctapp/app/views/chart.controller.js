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
    
    .controller('ChartController', function ($scope,LedgerFactory,chartService) {
        $scope.thelabels = ['Jan','Feb','Mar'];
        $scope.thedata= [100,200,150];
        
        init();
        
        function init() {
            
        }

        $scope.drawLedger = function() {
            console.log('drawLedger()');
            //var accounts = LedgerFactory.getAccountList();
            //var result = LedgerFactory.getMonthEndBalances(accounts[0].account_id);
            chartService.addSeries({ name: 'Account 2', data: [300,200,250]});
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