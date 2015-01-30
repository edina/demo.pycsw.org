/**
 *
 */
require.config({
    paths: {
        'jquery': 'libs/jquery',
        'jqueryxpath': 'libs/jquery.xpath',
        'leaflet': 'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet',
        'jqueryui': 'http://code.jquery.com/ui/1.11.1/jquery-ui.min',
        'QUnit': '//code.jquery.com/qunit/qunit-1.17.1',
        'underscore': 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore-min'
    },

    shim: {
        'QUnit': {
            exports: 'QUnit',
            init: function () {
                QUnit.config.autoload = false;
                QUnit.config.autostart = false;
            }
        }
    }
});
// require the unit tests.
require(
    ['QUnit', 'modules/tests'],
    function (QUnit, tests) {
        // run the tests.
        tests.run();

        // start QUnit.
        QUnit.load();
        QUnit.start();
    }
);