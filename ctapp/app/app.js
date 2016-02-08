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
        .state('map', {
            url: '/map',
            controller: 'MapController',
            templateUrl: 'app/mapview/mapview.html'
        });
    
});
