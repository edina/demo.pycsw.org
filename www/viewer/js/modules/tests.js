/*jslint browser: true*/
/*global $, define, console */

define(['modules/model', 'modules/metadata_mapping', 'jquery'], function (model, mappings) {



    var run = function () {

        var url = 'http://localhost/www/viewer/tests/testdoc.xml';
        test('test parse xml', function (assert) {

            assert.expect(6);
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

        test("test metadatamappings", function (assert) {

            assert.ok(mappings, "got mappings");

            function isObject(prop) {
                return prop !== null && typeof prop === 'object';

            }


            function recursiveParse(model, map, context) {

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
                            model[key] = map[key];

                        } else {

                            if (key !== 'value') {
                                var details = {};
                                model[key] = details;
                                model = details;
                            }
                            recursiveParse(model, prop, context);
                        }
                    }
                }
            }
            var mymodel = {};
            recursiveParse(mymodel, mappings, '/');
            console.dir(mymodel);


        });
    }

    return {
        run: run
    };
});