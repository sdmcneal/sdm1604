describe('fsApp.common.factories.ProfileFactory', function () {
    beforeEach(function() {
        module('fsApp.common.factories.Profiler');
    });
    
    var profile_factory;
    
    beforeEach(inject(function ($injector) {
        profile_factory = $injector.get('ProfileFactory');
    }));
    
    it('should be initialized', function () {
        expect(profile_factory).toBeDefined();
        
    });
    
    describe("startTimer", function() {
        it('should start timers', function () {
        var id = profile_factory.startTimer("timer 1");
        
        expect(id).toEqual(0);
        
        var timers = profile_factory.getTimers();
        expect(timers.length).toEqual(1);
        expect(timers[0].description).toEqual("timer 1");
        });
    });
    describe("endtimer", function() {
        it ('should time things', function() {
        var id = profile_factory.startTimer("timer 2");
        
        var msg = profile_factory.endTimer(id);
        
        console.log(msg);
        });
    });
    
})