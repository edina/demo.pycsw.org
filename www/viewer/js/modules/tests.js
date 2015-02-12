/*jslint browser: true*/
/*global $, define, console, test*/

define(['modules/model', 'modules/metadata_mapping', 'modules/parseiso', 'jquery'], function (model, mappings, parseiso) {
    'use strict';

    /* titles to test for  UK Earthquake Seismogram Data 
    Index To Specimens Transferred From The John Smith Collection To The UK (North) Type and Stratigraphical Collection
    graffiti edinburgh
    */
    var run = function () {

        var url = 'http://localhost/www/viewer/tests/testdoc.xml';
        test('Test parse xml record to iso data model', function (assert) {

            assert.expect(1);
            var done1 = assert.async();
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function (xml) {
                    var m = model.createRecordDetailsModel(xml);
                    assert.ok(xml, 'got test xml result');


                    testMainIdentification(m);

                    testIdentificationPointOfContact(m);


                    done1();
                },
                error: function (jqXHR, textStatus, errorThrow) {
                    alert("An error occurred while processing XML file." + errorThrow);
                }
            });

        });
    }


    function testMainIdentification(m) {
        test('Main indentification Elements', function (assert) {
            assert.equal(m.identification.title, "Index To Specimens Transferred From The John Smith Collection To The UK (North) Type and Stratigraphical Collection", "title");
            assert.equal(m.identification.alternatetitle, "alternate title", "Alternate title");
            assert.equal(m.datestamp, "2000-01-01T12:00:00", "datestamp test xpath or operation");
            assert.equal(m.identification.date.date, "1990", "date");
            assert.equal(m.identification.date.type, "creation", "dateType");
            assert.equal(m.identification.uniqueresourceidentifier, "http://data.bgs.ac.uk/id/dataHolding/13480091", "uniqueResourceIdentifier");
            assert.equal(m.identification.codeSpace, undefined, "codeSpace doesn't come back from pycsw");
            assert.equal(m.identification.abstract, "abstract here", "abstract");

        });

    };



    function testIdentificationPointOfContact(m) {
        test('Indentification point of contact Elements', function (assert) {

            assert.equal(m.identification.contact.name, "Tony", "Individual name");
            assert.equal(m.identification.contact.organization, "British Geological Survey", "Organisation name");
            assert.equal(m.identification.contact.role, "originator", "Role");
            assert.equal(m.identification.contact.phone, "+44 131 667 1000 Ex:354", "Voice");

            assert.equal(m.identification.contact.address, "Murchison House,West Mains Road", "Delivery point ");
            assert.equal(m.identification.contact.city, "EDINBURGH", "City");
            assert.equal(m.identification.contact.region, "LOTHIAN", "Administrative area");
            assert.equal(m.identification.contact.postcode, "EH9 3LA", "Postal code");
            assert.equal(m.identification.contact.country, "United Kingdom", "Country");
            assert.equal(m.identification.contact.email, "enquiries@bgs.ac.uk", "Electronic mail");

        });

    }

    return {
        run: run
    };
});