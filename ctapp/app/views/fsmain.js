app.controller('FSMainController', function($scope, FSUser) {
  var fsuser;
  var verbose = true;

  init();


  function init() {
    if (this.verbose) console.log("FSMainController::init()");
    fsuser = FSUser.user;
    fsuser.mockdata();
  };

  $scope.getUserJSON = function() {
    return fsuser.getJSON();
  };
  
  $scope.generateSchedule = function() {
    return fsuser.generateSchedule();
  }

});