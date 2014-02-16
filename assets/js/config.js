'use strict';

var paths = {
    text: '../bower_components/requirejs-text/text',
    angular: '../bower_components/angular/angular',
    handlebars: '../bower_components/handlebars/handlebars.amd',
    hb: 'util/handlebars-plugin'
};

// If file is required by node, export paths only
if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = paths;
} else {
    // If it's required by require.js, execute configuration function
    if (typeof define === 'function' && define.amd) {
        require.config({
            baseUrl: 'assets/js/',
            paths: paths,
            shim: {
                angular: {
                    exports: 'angular'
                }
            },
            priority: 'angular'
        });
    }
}
