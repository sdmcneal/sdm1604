'use strict';

angular.module('fsApp.common.factories.Profiler',[])
.factory('ProfileFactory', function() {
    var verbose = 1;
    var service = {};
    var timers = [];
    
    init();
    
    function init() {
        
    }
    
    service.startTimer = function(_description) {
        var s = Date.now();
        var new_timer = {
            start: s,
            description: _description 
        };
        timers.push(new_timer);
        return (timers.length-1);
        
    }
    service.endTimer = function(index) {
        var s= timers[index];
        s.elapsed = Date.now() - s.start;
        var msg = 'timer '+s.description+' took '+s.elapsed+' ms';
        return msg;
    }
    service.getTimers = function() {
        return timers;
    }
    return service;
});
