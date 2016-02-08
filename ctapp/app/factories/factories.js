app.factory('CrumbFactory', function() {
  return {
    data: {
      user: 99,
      trip: 88,
      route: 77,
      crumbs: []
    }
  };
});

app.factory('MapFactory',function() {
  return {
    map: '',
    setMap: function(_map) {
      console.log("setMap()");
      this.map = _map;
    }
  };
});