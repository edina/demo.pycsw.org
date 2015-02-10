/*jslint browser: true*/
/*global $, define, console */

define(['modules/model', 'modules/metadata_mapping', 'modules/parseiso', 'jquery'], function (model, mappings, parseiso) {



    var run = function () {

        var url = 'http://localhost/www/viewer/tests/testdoc.xml';
        test('Test parse xml record to iso data model', function (assert) {

            assert.expect(9);
            var done1 = assert.async();
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function (xml) {
                    var m = model.createRecordDetailsModel(xml);
                    assert.ok(xml, 'got xml');

                    assert.equal(m.identification.title, "Index To Specimens Transferred From The John Smith Collection To The UK (North) Type and Stratigraphical Collection", "title");
                    assert.equal(m.identification.alternatetitle, "alternate title", "Alternate title");
                    assert.equal(m.datestamp,
                        "2000-01-01T12:00:00", "datestamp test xpath or operation");
                    assert.equal(m.identification.date.date, "1990", "date");

                    assert.equal(m.identification.date.type, "creation", "dateType");
                    assert.equal(m.identification.uniqueresourceidentifier, "http://data.bgs.ac.uk/id/dataHolding/13480091", "uniqueResourceIdentifier");
                    assert.equal(m.identification.codeSpace, undefined, "codeSpace");
                    assert.equal(m.identification.abstract, "abstract here", "abstract");

                    //testMappings(xml);
                    done1();
                },
                error: function (jqXHR, textStatus, errorThrow) {
                    alert("An error occurred while processing XML file." + errorThrow);
                }
            });

        });


        function isObject(prop) {
            return prop !== null && typeof prop === 'object';

        }


        function recursiveParse(model, map, context, xml) {

            if (map.hasOwnProperty('context')) {
                context = context + map.context + '/';
            }

            for (var key in map) {
                //skip context nodes
                if (key === 'context') {
                    continue;
                }
                if (map.hasOwnProperty(key)) {
                    var prop = map[key];
                    if (!isObject(prop)) {

                        console.log(key + " -> " + context + map[key]);
                        var xpath = context + map[key];
                        var f = parseiso.getValueFromXPath(xpath, xml);
                        model[key] = f;

                    } else {

                        if (key !== 'value') {
                            var details = {};
                            model[key] = details;
                            model = details;
                        }
                        recursiveParse(model, prop, context, xml);
                    }
                }
            }
        }



        function testMappings(xml) {





        }
    }

    return {
        run: run
    };
});