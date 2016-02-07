var app = angular.module('CommuteTracerApp',['ngRoute','ngAnimate']);

app.config(['$routeProvider','$locationProvider',
function($routeProvider, $locationProvider) {
    $routeProvider
    .when('record', {
        controller: 'RecordController',
        templateUrl: 'app/partials/record.html'
    })
    .when('/historyList', {
        templateUrl: 'app/partials/trail.html',
        controller: 'RecordController'
    })
    .when('trail', {
        controller: 'RecordController',
        templateUrl: 'app/partials/trail.html'
    })
    .when('Track/commands', {
        controller: 'CommandCtrl',
        templateUrl: 'app/partials/commands.html'
    })
    .otherwise({
        redirectTo: '/CommuteTracerApp.html'
    });
}]);

app.controller('MainCtrl', ['$route', '$routeParams', '$location',
    function($route, $routeParams, $location) {
      this.$route = $route;
      this.$location = $location;
      this.$routeParams = $routeParams;
  }]);

app.controller('CommandCtrl',function() {
    this.name = "CommandCtrl";
});
