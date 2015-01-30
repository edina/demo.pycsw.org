/*jslint browser: true*/
/*global $, define, console */

define(['modules/model', 'jquery'], function (model) {



    var run = function () {

        var url = 'http://localhost/www/viewer/tests/testdoc.xml';
        test('test parse xml', function (assert) {

            assert.expect(1);
            var done1 = assert.async();
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function (xml) {
                    model.createRecordDetailsModel(xml);
                    assert.ok(xml, 'got xml');

                    done1();
                },
                error: function () {
                    alert("An error occurred while processing XML file.");
                }
            });

        });
    };
    return {
        run: run
    };
});