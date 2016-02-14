app.controller('WatchController', function($scope, $http, CrumbFactory) {
  var readytosave;
  var intervalId;
  var RECORD_INTERVAL;
  var mapskey = 'AIzaSyDCesxKKqiw6C-laScj06wtAhPJQY-rs10';

  init();

  function init() {
    RECORD_INTERVAL = 15000
    $scope.watchID;
    $scope.geoLocation;
    $scope.latitude;
    $scope.longitude;
    $scope.verbose = true;

    $scope.history = CrumbFactory.data;

    if ($scope.verbose) console.log("WatchController init()");
  }

  $scope.getLocationUpdate = function getLocationUpdate() {

    if ($scope.verbose) console.log("WatchController.getLocationUpdate()");

    if (navigator.geolocation) {
      var options = {
        timeout: 60000,
        enableHighAccuracy: false
      };

      this.intervalId = setInterval(function() {
        recordLastLocation();
        if ($scope.verbose) console.log("saving last location");
      }, 60000);

      $scope.geoLocation = navigator.geolocation;

      $scope.watchID = $scope.geoLocation.watchPosition(saveLocation,
        errorHandler, options);


    }
    else {
      alert("Browser does not support geolocation");
    }
  }

  $scope.stopUpdate = function() {
    if ($scope.verbose) console.log("WatchController.getLocationUpdate()");

    if ($scope.watchID) {
      navigator.geolocation.clearWatch($scope.watchID);

      $scope.watchID = null;

      if ($scope.verbose) console.log("updates stopped");
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  $scope.saveCrumbs = function() {
    var _json = JSON.stringify($scope.history);
    if ($scope.verbose) console.log('saving: ' + _json);
    $http({
      url: '/api/recordtrack',
      method: 'POST',
      data: $scope.history
    }).then(function(data,status) {
        if ($scope.verbose) console.log('recorded history'+ JSON.stringify(data) );
      },
      function(err) {
        console.log('error saving history: ' + err);
      });
  };

  function saveLocation(position) {
    $scope.longitude = position.coords.longitude;
    $scope.latitude = position.coords.latitude;

    if ($scope.verbose) {
      console.log("lat: " + $scope.latitude + ", long: " + $scope.longitude);
    }


  }

  function recordLastLocation() {
    var _crumb = {
      lat: $scope.latitude,
      long: $scope.longitude,
      date: new Date().toTimeString()
    }

    $scope.history.crumbs.push(_crumb);

    $scope.$apply();
  }

  function errorHandler(err) {
    var _msg;
    if (err.code == 1) {
      _msg = "Error: Access is denied";
    }
    else if (err.code == 2) {
      _msg = "Error: Position is not available";
    }
    alert(_msg);
    if ($scope.verbose) console.log(_msg);
  }
})