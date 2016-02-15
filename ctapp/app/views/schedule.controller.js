app.controller('ScheduleController',function($scope,ScheduleFactory) {
    var verbose = true;
    
    init();
    
    function init() {
        if (verbose) console.log('ScheduleController.init()');
    }
    
    $scope.schedule_entry_count = ScheduleFactory.getScheduleEntryCount();
    $scope.schedule_entries = ScheduleFactory.getScheduleEntries();
});