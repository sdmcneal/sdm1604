'use strict';

angular.module('fsApp.views.chart', ['fsApp.common.models'])
    .directive('hcChart', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                options: '='
            },
            link: function (scope, element) {
                Highcharts.chart(element[0], scope.options);
            }
        };
    })
    .directive('hcPieChart', function () {
        return {
            restrict: 'E',
            template: '<div></div>',
            scope: {
                title: '@',
                data: '='
            },
            link: function (scope, element) {
                Highcharts.chart(element[0], {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: scope.title
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                    series: [{
                        data: scope.data
                    }]
                });
            }
        };
    })
    .controller('ChartController', function ($scope,LedgerFactory) {
        $scope.thelabels = ['1','2','3'];
        $scope.thedata= [100,200,150];

        $scope.drawLedger = function() {
            var accounts = LedgerFactory.getAccountList();
            var result = LedgerFactory.getMonthEndBalances(accounts[0].account_id);

            $scope.thelabels = result.labels;
            $scope.thedata = result.data;
            

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

        // Sample data for pie chart
        $scope.pieData = [{
            name: "Microsoft Internet Explorer",
            y: 56.33
        }, {
            name: "Chrome",
            y: 24.03,
            sliced: true,
            selected: true
        }, {
            name: "Firefox",
            y: 10.38
        }, {
            name: "Safari",
            y: 4.77
        }, {
            name: "Opera",
            y: 0.91
        }, {
            name: "Proprietary or Undetectable",
            y: 0.2
        }]
    });