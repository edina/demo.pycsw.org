/*jslint browser: true*/

/*global $, define, console, test*/

define(['modules/model', 'modules/metadata_mapping', 'jquery'], function (mymodel, mappings) {
    'use strict';

    /* titles to test for  UK Earthquake Seismogram Data 
    Index To Specimens Transferred From The John Smith Collection To The UK (North) Type and Stratigraphical Collection
    or search for gui
    9df8df51-631c-37a8-e044-0003ba9b0d98
    
    graffiti edinburgh
    */



    function testMainIdentification(m) {
        test('Main indentification Elements', function (assert) {
            assert.equal(m.identification.title, "Index To Specimens Transferred From The John Smith Collection To The UK (North) Type and Stratigraphical Collection", "title");
            assert.equal(m.identification.alternatetitle, "alternate title", "Alternate title");
            assert.equal(m.datestamp, "2000-01-01T12:00:00", "datestamp test xpath or operation");
            assert.equal(m.identification.resourcelanguage, "English", "Language");
            assert.equal(m.identification.topiccategory, "geoscientificInformation", "Topic category code ");

            assert.equal(m.identification.date.date, "1990", "date");
            assert.equal(m.identification.date.type, "creation", "dateType");
            assert.equal(m.identification.uniqueresourceidentifier, "http://data.bgs.ac.uk/id/dataHolding/13480091", "uniqueResourceIdentifier");
            assert.equal(m.identification.codeSpace, undefined, "codeSpace doesn't come back from pycsw");
            assert.equal(m.identification.abstract, "abstract here", "abstract");
            assert.equal(m.identification.supplementalinformation, "Start date of data capture strictly not known, possibly 1993. Not added to since 1993. Data is being incorporated into Palaeosaurus.", "supplementalinformation");

        });
    }



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

    function testKeywordsAndMaintenance(m) {
        test('Keywords and Descriptions plus Maintenance', function (assert) {

            assert.equal(m.identification.maintenance, "notPlanned", "Maintenance and update frequency");
            assert.equal(m.identification.keywords.keywords[0], "Geology", "Keywords");
            assert.deepEqual(m.identification.keywords.keywords[1], ["Palaeontology", "Graphic logs", "Biostratigraphy", "Specimen collecting", "Fossils", "Type specimen"], "Keywords");
            assert.equal(m.identification.keywords.thesaurus[2], "GEMET - INSPIRE themes", "Thesaurus");

        });

    }

    function testConstraints(m) {
        test('Test Contraints ', function (assert) {

            assert.ok(m.identification.uselimitationlegal.toString().indexOf("the dataset is made freely available") !== -1, "Use limitation");
            assert.equal(m.identification.keywords.keywords[0], "Geology", "Keywords");
            assert.deepEqual(m.identification.keywords.keywords[1], ["Palaeontology", "Graphic logs", "Biostratigraphy", "Specimen collecting", "Fossils", "Type specimen"], "Keywords");
            assert.equal(m.identification.keywords.thesaurus[2], "GEMET - INSPIRE themes", "Thesaurus");
            assert.ok(m.identification.uselimitation.toString().indexOf(" Isle of Mull") !== -1, "Use limitation");
            assert.equal(m.identification.denominators.toString(), 10000, "Denominators");
            assert.equal(m.identification.distance, "0.0", "Distance");
            assert.equal(m.identification.uom, "urn:ogc:def:uom:EPSG::9001", "uom");

        });
    }

    function testExtent(m) {
        test('Test map Extent ', function (assert) {
            assert.equal(m.identification.extent.boundingBox.minx, "-8.6500", "bb west");
            assert.equal(m.identification.extent.boundingBox.maxx, "1.7800", "bb east");
            assert.equal(m.identification.extent.boundingBox.miny, "49.7700", "bb south");
            assert.equal(m.identification.extent.boundingBox.maxy, "60.8600", "bb west");

            assert.equal(m.identification.temporalextent_start.toString(), "2015-02-11", "temporalextent_start");
            assert.equal(m.identification.temporalextent_end.toString(), "2015-02-12", "temporalextent_end");


        });
    }

    function testDistribution(m) {
        test('Test distribution ', function (assert) {
            assert.equal(m.distribution.contact.organization, "British Geological Survey", "organization");
            assert.equal(m.distribution.contact.phone, "+44 115 936 3143", "voice");
            assert.equal(m.distribution.contact.fax, "+44 115 936 3276", "fax");
            assert.equal(m.distribution.contact.address, "Environmental Science Centre,Keyworth", "Delivery point");

            assert.equal(m.distribution.contact.city, "NOTTINGHAM", "city");
            assert.equal(m.distribution.contact.region, "NOTTINGHAMSHIRE", "region");
            assert.equal(m.distribution.contact.postcode, "NG12 5GG", "postcode");
            assert.equal(m.distribution.contact.country, "United Kingdom", "country");

            assert.equal(m.distribution.contact.email, "enquiries@bgs.ac.uk", "email");
            assert.equal(m.distribution.contact.role, "distributor", "role");
            assert.equal(m.distribution.format, "PAPER - Paper format", "format");
            assert.equal(m.distribution.version, "Not applicable", "version");
            assert.equal(m.distribution.onlineresource.url, "http://www.bgs.ac.uk/collections/home.html", "Online resource");
            


        });
    }

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
                    var m = mymodel.createRecordDetailsModel(xml);
                    assert.ok(xml, 'got test xml result');


                    testMainIdentification(m);

                    testIdentificationPointOfContact(m);

                    testKeywordsAndMaintenance(m);

                    testConstraints(m);

                    testExtent(m);

                    testDistribution(m);
                    done1();
                },
                error: function (jqXHR, textStatus, errorThrow) {
                    console.log("An error occurred while processing XML file." + errorThrow);
                }
            });

        });
    };





    return {
        run: run
    };
});