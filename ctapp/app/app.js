'use strict';

var app = angular.module('CommuteTracerApp', [
    'fsApp.common.models',
    'fsApp.views.ledger',
    'fsApp.views.catalog',
    'fsApp.views.chart',
    'fsApp.views.FinancialModel',
    'ui.router'
]);

app.config(
    function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'app/partials/home.html'
            })
            .state('current', {
                url: '/current',
                controller: 'WatchController',
                templateUrl: 'app/views/current.html'
            })
            .state('fsmain', {
                url: '/fsmain',
                controller: 'FSMainController',
                templateUrl: 'app/views/fsmain.html'
            })
            .state('catalog', {
                url: '/catalog',
                controller: 'CatalogController',
                templateUrl: 'app/views/catalog.html'
            })
            .state('schedule', {
                url: '/schedule',
                controller: 'ScheduleController',
                templateUrl: 'app/views/schedule.html'
            })
            .state('ledger', {
                url: '/ledger',
                controller: 'LedgerController',
                templateUrl: 'app/views/ledger.html'
            })
            .state('account', {
                url: '/account',
                controller: 'AccountCtrl',
                templateUrl: 'app/views/account.html'
            })
            .state('chart', {
                url: '/chart',
                controller: 'ChartController',
                templateUrl: 'app/views/chart.html'
            })
            .state('map', {
                url: '/map',
                controller: 'MapController',
                templateUrl: 'app/mapview/mapview.html'
            })
            .state('finmodel', {
                url: '/finmodel',
                controller: 'FinancialModelController',
                templateUrl: 'app/views/financialmodel.html'
            });

    });
