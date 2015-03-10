/*jslint browser: true*/

/*global $, define, console, test*/

define(['modules/model', 'modules/metadata_mapping', 'jquery'], function (mymodel, mappings) {
    'use strict';

    /*
     * test record dataset
     * Index To Specimens Transferred
     * From The John Smith Collection To The UK (North) Type and
     * Stratigraphical Collection
     *
     * 9df8df51-631c-37a8-e044-0003ba9b0d98
     *
     * test record service
     * fda1332a-0436-4949-863a-eb1a2bf8d6ff
     * Scottish Government Protected Sites View Service (WMS)
     first wms in geonetwork
     7c7860f2-99fe-4dc2-a135-14aa7b8d01f7
     *
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
            assert.equal(m.distribution.online.url, "http://www.bgs.ac.uk/collections/home.html", "Online resource");


        });
    }



    function testDataQuality(m) {
        test('Test Data Quality ', function (assert) {
            assert.equal(m.dataquality.level, "dataset", "Hierarchy level");
            assert.ok(m.dataquality.conformancetitle.toString().indexOf("INSPIRE") !== -1, "Conformance Title");
            assert.equal(m.dataquality.conformancedate, "2011", "Conformance Date");
            assert.equal(m.dataquality.conformancedatetype, "publication", "Conformance Date Type");
            assert.equal(m.dataquality.conformancedegree, "false", "Conformance Degree");

            assert.ok(m.dataquality.lineage.toString().indexOf("The original data are specimens and slides") !== -1, "Linage Statement");

            assert.equal(m.dataquality.explanation, "See the referenced specification", "Explanation");

        });
    }

    function testMetaDataSection(m) {
        test('Test Metadata Section ', function (assert) {
            assert.equal(m.identifier, "9df8df51-631c-37a8-e044-0003ba9b0d98", "File identifier");
            assert.equal(m.languagecode, "English", "Metadata language  ");
            assert.equal(m.hierarchy, "dataset", "Hierarchy Level");
            assert.equal(m.dataseturi, "http://data.bgs.ac.uk/id/dataHolding/13480091", "Dataset url");
            assert.equal(m.datetimestamp, "2000-01-01T12:00:00", "Datetime stamp");
            assert.equal(m.stdname, "NERC profile of ISO19115:2003", "Metadata standard name ");
            assert.equal(m.stdver, "1.0", "Metadata standard version ");

            //metadata contact
            assert.equal(m.contact.name, "Dean,Mark Thornton", "Individual name");
            assert.equal(m.contact.position, "NERC-BGS Field Palaeontologist", "Position");
            assert.equal(m.contact.organization, "British Geological Survey", "organization");
            assert.equal(m.contact.phone, "+44 131 667 1000 Ex:354", "voice");

            assert.equal(m.contact.address, "Murchison House,West Mains Road", "Delivery point");

            assert.equal(m.contact.city, "EDINBURGH", "city");
            assert.equal(m.contact.region, "LOTHIAN", "region");
            assert.equal(m.contact.postcode, "EH9 3LA", "postcode");
            assert.equal(m.contact.country, "United Kingdom", "country");

            assert.equal(m.contact.email, "mtd@bgs.ac.uk", "email");
            assert.equal(m.contact.role, "pointOfContact", "role");

        });
    }

    function testServiceExtent(m) {
        test('Test service map Extent ', function (assert) {
            assert.equal(m.serviceidentification.bbox.boundingBox.minx, "-7.75714", "bb west");
            assert.equal(m.serviceidentification.bbox.boundingBox.maxx, "-0.53202", "bb east");
            assert.equal(m.serviceidentification.bbox.boundingBox.miny, "54.53297", "bb south");
            assert.equal(m.serviceidentification.bbox.boundingBox.maxy, "61.46459", "bb north");



        });
    }

    function testReferenceSystemInformation(m) {
        test('Test Reference System Information ', function (assert) {
            assert.equal(m.referencesystem.code, "OSGB 1936 / British National Grid (EPSG:27700)", "Unique resource identifier ");
            assert.equal(m.referencesystem.codeSpace, "EPSG", "Codespace");
            assert.equal(m.referencesystem.version, "7.4", "Version");



        });
    }

    function testServiceIdenfication(m) {

        test('Test Service Idenfication', function (assert) {
            assert.equal(m.identifier, "fda1332a-0436-4949-863a-eb1a2bf8d6ff", "File identifier");
            assert.equal(m.languagecode, "eng", "Metadata language  ");
            assert.equal(m.hierarchy, "service", "Hierarchy Level");


            assert.equal(m.serviceidentification.type, "view", "Service type");
            assert.equal(m.serviceidentification.couplingtype, "tight", "Coupling type");

            assert.equal(m.serviceidentification.contains, "2000-01-01T12:00:00", "Contains Operations");
            assert.equal(m.serviceidentification.operateson.title[0], "Aquifer classification", "Operates On Title");
            assert.equal(m.serviceidentification.operateson.href[0], "url to record", "Operates On url");
            assert.equal(m.serviceidentification.operateson.uuidref[0], "9df8df53-2aa9-37a8-e044-0003ba9b0d98", "Operates On uid");
            assert.equal(m.stdver, "1.0", "Metadata standard version ");

            //metadata contact
            assert.equal(m.contact.name, "Dean,Mark Thornton", "Individual name");
            assert.equal(m.contact.position, "NERC-BGS Field Palaeontologist", "Position");
            assert.equal(m.contact.organization, "British Geological Survey", "organization");
            assert.equal(m.contact.phone, "+44 131 667 1000 Ex:354", "voice");

            assert.equal(m.contact.address, "Murchison House,West Mains Road", "Delivery point");

            assert.equal(m.contact.city, "EDINBURGH", "city");
            assert.equal(m.contact.region, "LOTHIAN", "region");
            assert.equal(m.contact.postcode, "EH9 3LA", "postcode");
            assert.equal(m.contact.country, "United Kingdom", "country");

            assert.equal(m.contact.email, "mtd@bgs.ac.uk", "email");
            assert.equal(m.contact.role, "pointOfContact", "role");

        });
    }

    var run = function () {

        var datasetUrl = 'http://localhost/www/viewer/tests/testdoc.xml',
            serviceUrl = 'http://localhost/www/viewer/tests/serviceresult.xml';
        test('Test dataset result ', function (assert) {

            assert.expect(1);
            var done1 = assert.async();
            $.ajax({
                type: "GET",
                url: datasetUrl,
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

                    testDataQuality(m);


                    testMetaDataSection(m);
                    done1();
                },
                error: function (jqXHR, textStatus, errorThrow) {
                    console.log("An error occurred while processing XML file." + errorThrow);
                }
            });

        });

        test('Test service result', function (assert) {

            assert.expect(1);
            var done1 = assert.async();
            $.ajax({
                type: "GET",
                url: serviceUrl,
                dataType: "xml",
                success: function (xml) {
                    var m = mymodel.createRecordDetailsModel(xml);
                    assert.ok(xml, 'got test xml result');

                    testServiceExtent(m);
                    testReferenceSystemInformation(m);
                    testServiceIdenfication(m);


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