/*jslint browser: true*/
/*global $, define, console */

define(['jquery'], function () {
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
        var link = {};
        link.value = $(xml).text();
        link.scheme = 'None';
        var scheme = $(xml).attr('scheme');
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



    var createRecordsModel = function (xml) {
        console.log(xml);
        var records = [];
        
        $(escapeElementName('csw:Record'), xml).each(function (record) {
            var cswRecord = this;
            var rec = createCswRecord(cswRecord);
            records.push(rec);
        });
    };



    return {
        createRecordsModel: createRecordsModel

    };

});