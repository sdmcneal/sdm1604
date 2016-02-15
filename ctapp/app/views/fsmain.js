app.controller('FSMainController', function($scope, FSUser, UserFactory,
  AccountFactory, CatalogFactory, ScheduleFactory, ConstantsFactory) {
  var fsuser;
  var verbose = true;

  init();


  function init() {
    if (verbose) console.log("FSMainController::init()");
    fsuser = FSUser.user;
    fsuser.mockdata();
    fsuser.models[0].setupAccounts(fsuser.accounts);

    // new refactor (starting build 20)
    UserFactory.addUser("John");

    var checking_id = AccountFactory.addAccount("Checking", "Liquid", 1000.0, new Date());
    var savings_id = AccountFactory.addAccount("Savings", "Liquid", 1000.0, new Date());
    var federal_id = AccountFactory.addAccount("Federal Tax", "Report", 0.0, new Date(2016, 0, 1));

    var paycheck_id = CatalogFactory.addCatalogEntry("Gross Paycheck", null,
      ConstantsFactory.FIXED, checking_id, null, null, null, 10000.0,
      ConstantsFactory.FREQ_MONTHLY, 1, null, null, null);
      
  }

  $scope.user_count = UserFactory.getUserCount();
  $scope.user_list = UserFactory.getUserList();

  $scope.account_count = AccountFactory.getAccountCount();
  $scope.account_list = AccountFactory.getAccountList();

  $scope.getUserJSON = function() {
    return fsuser.getJSON();
  };

  $scope.generateSchedule = function() {
    var _start = (new Date()).getTime() / 1000.0;

    var _return = fsuser.generateSchedule();

    var _end = (new Date()).getTime() / 1000.0;

    console.log('elapsed time for generate schedule() = ' + (_end - _start) + ' seconds');



    _end = (new Date()).getTime() / 1000.0;
    console.log('total time = ' + (_end - _start) + ' seconds');

    return _return;
  };

  $scope.getLedger = function(account_id) {
    return fsuser.models[0].getLedger(account_id);
  };
});