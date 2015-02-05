/*jslint browser: true*/
/*global $, define, console */

define(['jquery', 'jqueryxpath', 'underscore'], function () {
    'use strict';



    var namespaces = {
            None: 'http://www.isotc211.org/2005/gmd',
            'gco': 'http://www.isotc211.org/2005/gco',
            'gmd': 'http://www.isotc211.org/2005/gmd',
            'gml': 'http://www.opengis.net/gml',
            'gml32': 'http://www.opengis.net/gml/3.2',
            'gmx': 'http://www.isotc211.org/2005/gmx',
            'gts': 'http://www.isotc211.org/2005/gts',
            'srv': 'http://www.isotc211.org/2005/srv',
            'xlink': 'http://www.w3.org/1999/xlink',
            'csw': "http://www.opengis.net/cat/csw/2.0.2"
        },


        mappings = {
            "identifier": "gmd:fileIdentifier/gco:CharacterString",
            "title": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString",
            "alternateTitle": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:alternateTitle",
            "abstract": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:abstract/gco:CharacterString",
            "date": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:date/gco:Date",
            "dateType": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:date/gmd:CI_Date/gmd:dateType",
            "uniqueResourceIdentifier": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:identifier/gmd:MD_Identifier/gmd:code/gco:CharacterString",
            "codeSpace": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:citation/gmd:CI_Citation/gmd:identifier/gmd:MD_Identifier/gmd:codeSpace/gco:CharacterString",
            "language": "gmd:language/gmd:LanguageCode/@codeListValue",
            "keywords": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:keyword",
            "parentidentifier": "gmd:parentIdentifier/gco:CharacterString",
            "dataseturi": "gmd:dataSetURI/gco:CharacterString",
            "languagecode": "gmd:language/gmd:LanguageCode",
            "datestamp": "gmd:dateStamp/gco:Date or gmd:dateStamp/gco:DateTime",
            "charset": "gmd:characterSet/gmd:MD_CharacterSetCode/@codeListValue",
            "hierarchy": "gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue",
            "datetimestamp": "gmd:dateStamp/gco:DateTime"

        },



        isoNamespaces = function (prefix) {
            var ns = namespaces[prefix];
            return ns;

        },

        getValueFromXPath = function (path, xml) {

            var xpathResult = $(xml).xpath(path, isoNamespaces),
                arr = [];
            xpathResult.each(function () {
                arr.push($.trim(this.textContent));

            });
            if (arr.length === 1) {
                return arr[0];
            } else {
                return arr;
            }

        },

        buildIsoDoc = function (xml) {
            var MD_metadata_element = $(xml).xpath('/csw:GetRecordByIdResponse/gmd:MD_Metadata', isoNamespaces),

                isoModel = {},
                key;
            for (key in mappings) {
                console.log(key);
                console.log(mappings[key]);
                isoModel[key] = getValueFromXPath(mappings[key], MD_metadata_element);
            }
            return isoModel;

        };

    return {
        getValueFromXPath: getValueFromXPath,
        buildIsoDoc: buildIsoDoc
    };
});