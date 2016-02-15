app.controller('CatalogController',function($scope,CatalogFactory,ScheduleFactory) {
   var verbose = true;
   
   
   init();
   
   function init() {
       if (verbose) console.log('CatalogController.init()');
   }
   
   $scope.catalogEntryCount = CatalogFactory.getCatalogEntryCount();
   $scope.catalogEntries = CatalogFactory.getCatalogEntries();
   
   
   
});