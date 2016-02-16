module.exports = function(config) {
    config.set({
        basePath: '.',
        frameworks: ['jasmine'],
        browsers: ['Chrome'],
        files: [
            { pattern: 'bower_components/angular/angular.js', watched: false },
            'bower_components/angular-mocks/angular-mocks.js',
            'bower_components/angular-resource/angular-resource.js',
            { pattern: 'ctapp/app/**/*.js'},
            { pattern: 'ctapp/test/**/*.js' }
        ]
    });
};