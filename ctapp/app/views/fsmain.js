app.controller('FSMainController', function($scope, FSUser) {
  var fsuser;
  var verbose = true;

  init();


  function init() {
    if (this.verbose) console.log("FSMainController::init()");
    fsuser = FSUser.user;
    fsuser.mockdata();
    fsuser.models[0].setupAccounts(fsuser.accounts);
  };

  $scope.getUserJSON = function() {
    return fsuser.getJSON();
  };
  
  $scope.generateSchedule = function() {
    var _start = (new Date()).getTime()/1000.0;
    
    var _return = fsuser.generateSchedule();
    
    var _end = (new Date()).getTime()/1000.0;
    
    console.log('elapsed time for generate schedule() = ' + (_end-_start) + ' seconds');
    
    
    
    _end = (new Date()).getTime()/1000.0;
    console.log('total time = '+ (_end-_start) + ' seconds')
    
    return _return;
  }

  $scope.getLedger= function(account_id) {
    return fsuser.models[0].getLedger(account_id);
  }
});