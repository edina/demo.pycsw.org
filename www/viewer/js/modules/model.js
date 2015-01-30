/*jslint browser: true*/
/*global $, define, console */

define(['modules/parseiso', 'jquery'], function (iso) {
    'use strict';


    function escapeElementName(str) {
        return str.replace(':', '\\:').replace('.', '\\.');
    }

    function createBoundingBox(xml) {
        var bb = {},
            ll = $(xml).find(escapeElementName('ows:LowerCorner')).text().split(' '),
            ur = $(xml).find(escapeElementName('ows:UpperCorner')).text().split(' ');
        bb.minx = ll[1];
        bb.miny = ll[0];
        bb.maxx = ur[1];
        bb.maxy = ur[0];
        bb.csv = [ll[0], ll[1], ur[0], ur[1]].join();

        return bb;
    }

    function createLink(xml) {
        var link = {},
            scheme = $(xml).attr('scheme');
        link.value = $(xml).text();
        link.scheme = 'None';
        if (scheme !== 'None' && scheme !== "") {
            link.scheme = scheme;
        }
        return link;
    }

    function createCswRecord(xml) {

        var cswRecord = {};

        cswRecord.identifier = $(xml).find(escapeElementName('dc:identifier')).text();
        cswRecord.type = $(xml).find(escapeElementName('dc:type')).text();
        cswRecord.title = $(xml).find(escapeElementName('dc:title')).text();
        cswRecord.abstract = $(xml).find(escapeElementName('dct:abstract')).text();
        cswRecord.publisher = $(xml).find(escapeElementName('dc:publisher')).text();
        cswRecord.abstract2 = $(xml).find(escapeElementName('dct:abstract')).text();
        cswRecord.source = $(xml).find(escapeElementName('dc:source')).text();
        cswRecord.date = $(xml).find(escapeElementName('dc:date')).text();
        cswRecord.modified = $(xml).find(escapeElementName('dct:modified')).text();
        cswRecord.references = [];
        cswRecord.bbox = createBoundingBox($(xml).find(escapeElementName('ows:BoundingBox')));

        // get all links
        $(xml).find(escapeElementName('dct:references')).each(function () {
            var linkRefsXml = this;
            cswRecord.references.push(createLink(linkRefsXml));
        });

        return cswRecord;
    }






    var protocols = {
            "None": ["Unknown", "WWW"],
            "ESRI:AIMS--http--configuration": ["ArcIMS Map Service Configuration File (*.AXL)", "ArcIMS"],
            "ESRI:AIMS--http-get-feature": ["ArcIMS Internet Feature Map Service", "ArcIMS"],
            "ESRI:AIMS--http-get-image": ["ArcIMS Internet Image Map Service", "ArcIMS"],
            "GLG:KML-2.0-http-get-map": ["Google Earth KML service (ver 2.0)", "KML"],
            "OGC:CSW": ["OGC-CSW Catalogue Service for the Web", "CSW"],
            "OGC:KML": ["OGC-KML Keyhole Markup Language", "KML"],
            "OGC:GML": ["OGC-GML Geography Markup Language", "GML"],
            "OGC:ODS": ["OGC-ODS OpenLS Directory Service", "OpenLS"],
            "OGC:OGS": ["OGC-ODS OpenLS Gateway Service", "OpenLS"],
            "OGC:OUS": ["OGC-ODS OpenLS Utility Service", "OpenLS"],
            "OGC:OPS": ["OGC-ODS OpenLS Presentation Service", "OpenLS"],
            "OGC:ORS": ["OGC-ODS OpenLS Route Service", "OpenLS"],
            "OGC:SOS": ["OGC-SOS Sensor Observation Service", "SOS"],
            "OGC:SPS": ["OGC-SPS Sensor Planning Service", "SPS"],
            "OGC:SAS": ["OGC-SAS Sensor Alert Service", "SAS"],
            "OGC:WCS": ["OGC-WCS Web Coverage Service", "WCS"],
            "OGC:WCS-1.1.0-http-get-capabilities": ["OGC-WCS Web Coverage Service (ver 1.1.0)", "WCS"],
            "OGC:WCTS": ["OGC-WCTS Web Coordinate Transformation Service", "WCTS"],
            "OGC:WFS": ["OGC-WFS Web Feature Service", "WFS"],
            "OGC:WFS-1.0.0-http-get-capabilities": ["OGC-WFS Web Feature Service (ver 1.0.0)", "WFS"],
            "OGC:WFS-G": ["OGC-WFS-G Gazzetteer Service", "WFS-G"],
            "OGC:WMC-1.1.0-http-get-capabilities": ["OGC-WMC Web Map Context (ver 1.1)", "WMC"],
            "OGC:WMS": ["OGC-WMS Web Map Service", "WMS"],
            "OGC:WMS-1.1.1-http-get-capabilities": ["OGC-WMS Capabilities service (ver 1.1.1)", "WMS"],
            "OGC:WMS-1.3.0-http-get-capabilities": ["OGC-WMS Capabilities service (ver 1.3.0)", "WMS"],
            "OGC:WMS-1.1.1-http-get-map": ["OGC Web Map Service (ver 1.1.1)", "WMS"],
            "OGC:WMS-1.3.0-http-get-map": ["OGC Web Map Service (ver 1.3.0)", "WMS"],
            "OGC:SOS-1.0.0-http-get-observation": ["OGC-SOS Get Observation (ver 1.0.0)", "SOS"],
            "OGC:SOS-1.0.0-http-post-observation": ["OGC-SOS Get Observation (POST) (ver 1.0.0)", "SOS"],
            "OGC:WNS": ["OGC-WNS Web Notification Service", "WNS"],
            "OGC:WPS": ["OGC-WPS Web Processing Service", "WPS"],
            "WWW:DOWNLOAD-1.0-ftp--download": ["File for download through FTP", "FTP"],
            "WWW:DOWNLOAD-1.0-http--download": ["File for download", "HTTP"],
            "FILE:GEO": ["GIS file", "GIS"],
            "FILE:RASTER": ["GIS RASTER file", "Raster"],
            "WWW:LINK-1.0-http--ical": ["iCalendar (URL)", "iCal"],
            "WWW:LINK-1.0-http--link": ["Web address (URL)", "WWW"],
            "WWW:LINK-1.0-http--partners": ["Partner web address (URL)", "WWW"],
            "WWW:LINK-1.0-http--related": ["Related link (URL)", "WWW"],
            "WWW:LINK-1.0-http--rss": ["RSS News feed (URL)", "RSS"],
            "WWW:LINK-1.0-http--samples": ["Showcase product (URL)", "WWW"],
            "DB:POSTGIS": ["PostGIS database table", "PostGIS"],
            "DB:ORACLE": ["ORACLE database table", "Oracle"],
            "WWW:LINK-1.0-http--opendap": ["OPeNDAP URL", "OPeNDAP"],
            "RBNB:DATATURBINE": ["Data Turbine", "turbine"],
            "UKST": ["Unknown Service Type", "unknown"],
            "WWW:LINK-1.0-http--image-thumbnail": ["Web image thumbnail (URL)", "thumb"]
        },


        createRecordsModel = function (xml) {
            var records = [];

            $(escapeElementName('csw:Record'), xml).each(function (record) {
                var cswRecord = this,
                    rec = createCswRecord(cswRecord);
                records.push(rec);
            });

            return records;
        },


        resultsSummary = function (xml) {
            var resultsSummary = {
                matched: parseInt($(xml).find(escapeElementName('csw:SearchResults')).attr('numberOfRecordsMatched'), 10),
                returned: parseInt($(xml).find(escapeElementName('csw:SearchResults')).attr('numberOfRecordsReturned'), 10),
                nextrecord: parseInt($(xml).find(escapeElementName('csw:SearchResults')).attr('nextRecord'), 10),
                isResults: function () {
                    return this.matched === 0;
                },
                moreRecords: function () {
                    if (this.nextrecord === 0 || this.nextrecord >= this.matched) {
                        this.nextrecord = this.matched;
                        return true;
                    } else {
                        return false;
                    }

                }

            };
            return resultsSummary;
        },
        protocolShortCode = function (protocol) {
            var protocolDetails = protocols[protocol],
                protocolShortCode = 1;
            if (protocolDetails) {
                return protocolDetails[protocolShortCode];
            } else {
                console.log('err no protocol found ' + protocol);
                return protocols.None.protocolShortCode;
            }
        },
        createRecordDetailsModel = function (xml) {
            console.log(xml);

            var dataModel = iso.buildIsoDoc(xml);

            return dataModel;
        };





    return {
        createRecordsModel: createRecordsModel,
        resultsSummary: resultsSummary,
        protocolShortCode: protocolShortCode,
        createRecordDetailsModel: createRecordDetailsModel
    };

});