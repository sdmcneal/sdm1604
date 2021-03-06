app.controller('RecordController', function($scope,$location,$routeParams,CrumbFactory) {
  init();

  function init() {
    console.log("init()");
    $scope.data = CrumbFactory.data;
    $scope.verbose = true;
  }


  $scope.recordLocation = function() {
    console.log('recordLocation()');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        
        if ($scope.verbose) logPosition(position);

        var new_crumb = {
          lat: position.coords.latitude,
          long: position.coords.longitude,
          date: "now"
        };

        $scope.data.crumbs.push(new_crumb);

        $scope.$apply();
        
        if ($scope.verbose) console.log("crumbs.length="+$scope.data.crumbs.length);

      })
    } else {
      console.log('No geolocation access');
    }
  }
  
  $scope.showHistoryTable = function(pathurl) {
    console.log(pathurl);
    $location.path(pathurl);
  }
  
  function logPosition(pos) {
    console.log("latitude:" + pos.coords.latitude 
    + ", longitude: " + pos.coords.longitude);
  }
});

