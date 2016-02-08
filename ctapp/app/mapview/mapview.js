app.controller('MapController', function($scope, CrumbFactory, MapFactory) {
  $scope.mapkey = 'AIzaSyDCesxKKqiw6C-laScj06wtAhPJQY-rs10';
  $scope.map;
  this.verbose = true;

  init();

  function init() {
    if (this.verbose) console.log("MapController init()");

    $scope.history = CrumbFactory.crumbs;

    if (typeof google === 'object' && typeof google.maps === 'object') {


      var _lastcoord = getLastCoordinates();
      var _options = {
        zoom: 8,
        center: new google.maps.LatLng(_lastcoord.lat, _lastcoord.lng),
        mapTypeId: google.maps.MapTypeId.TERRAIN
      }

      $scope.map = new google.maps.Map(document.getElementById('map'), _options);
    } else {
      alert("Google map API not loaded");
    }

  }

  function getLastCoordinates() {
    if ($scope.history) {
      var _index = $scope.history.length - 1;

      var _coord = {
        lat: $scope.history.crumbs[_index].lat,
        lng: $scope.history.crumbs[_index].long
      };

      if (this.verbose) console.log(JSON.parse(_coord));

      return _coord;

    }
    else {
      return {
        lat: 47.542,
        lng: -122.01
      };
    }
  }
});