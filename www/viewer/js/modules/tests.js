/*jslint browser: true*/
/*global $, define, console */

define(['modules/model', 'jquery'], function (model) {



    var run = function () {

        var url = 'http://localhost/www/viewer/tests/testdoc.xml';
        test('test parse xml', function (assert) {

            assert.expect(4);
            var done1 = assert.async();
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function (xml) {
                    var m = model.createRecordDetailsModel(xml);
                    assert.ok(xml, 'got xml');

                    assert.equal(m.date, "1990", "date");
                    assert.equal(m.title, "Index To Specimens Transferred From The John Smith Collection To The UK (North) Type and Stratigraphical Collection", "title");
                    assert.equal(m.dateType, "creation", "dateType");
                    assert.equal(m.uniqueResourceIdentifier, "http://data.bgs.ac.uk/id/dataHolding/13480091", "uniqueResourceIdentifier");
                    assert.equal(m.codeSpace, "", "codeSpace");
                    done1();
                },
                error: function (jqXHR, textStatus, errorThrow) {
                    alert("An error occurred while processing XML file." + errorThrow);
                }
            });

        });
    };
    return {
        run: run
    };
});