var app = angular.module('CommuteTracerApp', [
    'ui.router'
]);

app.config(
    function($stateProvider, $urlRouterProvider) {
        
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
        .state('map', {
            url: '/map',
            controller: 'MapController',
            templateUrl: 'app/mapview/mapview.html'
        });
    
});
