app.controller('FSMainController', function($scope, UserFactory,
  LedgerFactory, CatalogFactory, ScheduleFactory, ConstantsFactory) {
  var fsuser;
  var verbose = 3;

  init();


  function init() {
    if (verbose>=2) console.log("FSMainController::init()");

    //  ConstantsFactory.FREQ_MONTHLY, 1, null, null, null);
      
  }
  $scope.createMocks = function () {
    if (verbose>=2) console.log("FSMainController::createMocks()");
    
    // new refactor (starting build 20)
    UserFactory.addUser("John");

    var checking_id = LedgerFactory.addAccount("Checking", "Liquid", 1000.0, new Date());
    var savings_id = LedgerFactory.addAccount("Savings", "Liquid", 1000.0, new Date());
    var federal_id = LedgerFactory.addAccount("Federal Tax", "Report", 0.0, new Date(2016, 0, 1));
    
    var catalog_entry1 = {
                frequency: ConstantsFactory.FREQ_MONTHLY,
                frequency_param: 15,
                catalog_entry_type: ConstantsFactory.FIXED,
                catalog_entry_id: 1201,
                amount: -76.0,
                amount_calc: 0.0,
                account_id: checking_id,
                description: 'HOA',
                start_date: new Date(2016, 1, 12),
                end_date: new Date(2016, 6, 15)
            };
    var hoa_id = CatalogFactory.addCatalogEntry(catalog_entry1);
    
    var catalog_entry2 = {
                frequency: ConstantsFactory.FREQ_FIRST_WEEKDAY_OF_MONTH,
                frequency_param: 15,
                catalog_entry_type: ConstantsFactory.FIXED,
                catalog_entry_id: 1201,
                amount: 5000.0,
                amount_calc: 0.0,
                account_id: checking_id,
                description: 'Gross Paycheck',
                start_date: new Date(2016, 1, 12),
                end_date: new Date(2016, 6, 15)
            };
    var paycheck_id = CatalogFactory.addCatalogEntry(catalog_entry2);

    var catalog_entry3 = {
      description: 'Interest',
      parent_id: '',
      catalog_entry_type: ConstantsFactory.TYPE_INTEREST_ON_BALANCE,
      account_id: checking_id,
      paired_account_id: '',
      start_date: new Date(2016,0,1),
      end_date: new Date(2016,11,31),
      amount: 0.0,
      amount_calc: 0.1,
      frequency: ConstantsFactory.FREQ_MONTHLY,
      frequency_param: 0,
      param1: '',
      param2: '',
      tax_year_maximum: ''
    }
    var interest_id = CatalogFactory.addCatalogEntry(catalog_entry3);
  };

  $scope.user_count = UserFactory.getUserCount();
  $scope.user_list = UserFactory.getUserList();

  $scope.account_count = LedgerFactory.getAccountCount();
  $scope.account_list = LedgerFactory.getAccountList();

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