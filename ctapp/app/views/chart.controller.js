'use strict';

angular.module('fsApp.views.chart', [
    'fsApp.common.models',
    'fsApp.common.factories.Profiler'])
.factory('chartService', function($rootScope) {
    var service = {};
   
    
    service.chart = '';
    
    service.setChart = function(chart) {
        service.chart = chart;
    }
    service.addSeries = function (labels,series) {
        service.chart.xAxis[0].setCategories(labels);
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
                        chart: { 
                            type: 'column',
                            renderTo: element[0] 
                        }
                    };
                    var config = angular.extend(defaultOptions,scope.options);
                    chartService.setChart( new Highcharts.chart(config) );
                }
                
                scope.$watch("config.series", function(loading) {
                    //console.log('watch()'+JSON.stringify(scope.options));
                    //chart.addSeries({ name: 'Account 2', data: [300,200,250]});
                });
                
            }
        };
    })
    .factory('netChartService', function($rootScope) {
    var service = {};
   
    
    service.chart = '';
    
    service.setChart = function(chart) {
        service.chart = chart;
    }
    service.addSeries = function (labels,series) {
        service.chart.xAxis[0].setCategories(labels);
        service.chart.addSeries(series);
    }
    return service;
})
    .directive('netHcChart', function (netChartService) {
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
                        chart: { 
                            type: 'column',
                            renderTo: element[0] 
                        }
                    };
                    var config = angular.extend(defaultOptions,scope.options);
                    netChartService.setChart( new Highcharts.chart(config) );
                    
                }
                
                scope.$watch("config.series", function(loading) {
                    //console.log('watch()'+JSON.stringify(scope.options));
                    //chart.addSeries({ name: 'Account 2', data: [300,200,250]});
                });
                
            }
        };
    })
    
    .controller('ChartController', function ($scope,LedgerFactory,chartService,
    netChartService,CalculationEngine,ProfileFactory,ConstantsFactory) {
        $scope.thelabels = ['Jan','Feb','Mar'];
        $scope.thedata= [100,200,150];
        $scope.time_scales = [];
         var verbose = 1;
        var profile_id;
        var show_profile = true;
        $scope.cash_assets = [];
        $scope.all_accounts = [];
        $scope.labels = [];
        
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
            if (verbose>=2) console.log('drawLedger()');
            profile_id = ProfileFactory.startTimer("drawLedger()");
            var accounts = LedgerFactory.getAccountList();
            
            accounts.forEach(function (a) {
                
                    var result;
                    if ($scope.current_time_scale<=2) {
                        result = LedgerFactory.getMonthEndBalances(a._id,
                        $scope.start_date,$scope.end_date);
                    }
                    if ($scope.current_time_scale==3) {
                        result = LedgerFactory.getYearEndBalances(a._id,
                        $scope.start_date,$scope.end_date);
                    }
                
                    // round and use thousands
                    var data_in_k = [];
                    result.data.forEach(function(d) {
                        var t = Math.round(d / 100.0);
                        data_in_k.push(t/10.0);
                    });
                    if (verbose>=3) console.log(' data_in_k: '+JSON.stringify(data_in_k));
                    if (a.type==ConstantsFactory.ASSET_CLASS_CASH) {
                        chartService.addSeries(result.labels,{ name: a.name, data: data_in_k});
                
                        $scope.cash_assets.push({name: a.name, data: result.data});
                    }
                    netChartService.addSeries(result.labels,{ name: a.name, data: data_in_k});
                    $scope.all_accounts.push({name: a.name, data: result.data});
                    
                    $scope.time_labels = result.labels;
                
                
            });
            if (show_profile) console.log(ProfileFactory.endTimer(profile_id));
            //$scope.chartOptions.series = [{ name: 'Account 2', data: [300,200,250]}];
            if (verbose>=3) console.log('chartOptions='+JSON.stringify($scope.chartOptions));
        };
        // Sample options for first chart
        $scope.chartOptions = {
            title: {
                text: 'Forecast Summary'
            },
            xAxis: {
                categories: $scope.thelabels
            },
            yAxis: {
                title: {
                    text: 'Total Balance'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    dataLabels: {
                       enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black'
                        }
                    }
                }
            },
            series: []
        };

        
    });