/*jslint browser: true*/
/*global $, define, console */

define(['modules/metadata_mapping', 'jquery', 'jqueryxpath', 'underscore'], function (mappings) {
    'use strict';


    function isObject(prop) {
        return prop !== null && typeof prop === 'object';

    }




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

        /*
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

                },*/



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
            var isoModel = {},
                xpathOr = " or ";
            recursiveParse(isoModel, mappings, '/csw:GetRecordByIdResponse/gmd:MD_Metadata/');

            function recursiveParse(model, map, context) {
                var key;
                if (map.hasOwnProperty('context')) {
                    //what if context has or xpath operator;
                    if (map.context.indexOf(xpathOr) > -1) {
                        context = handleXpathOrOperationInContext(map.context, context);
                    } else {
                        context = context + map.context;

                    }
                    context = context + '/';
                }

                for (key in map) {
                    //skip context nodes
                    if (key === 'context') {
                        continue;
                    }
                    if (map.hasOwnProperty(key)) {
                        var prop = map[key];
                        //debug
                        if (key == 'organization') {
                            console.log(key);
                        }

                        if (!isObject(prop)) {
                            var xpath = map[key];

                            //test expression has an operator as it doesn't work in this impl
                            var xpathResult = undefined;
                            if (xpath.indexOf(xpathOr) > -1) {
                                xpathResult = handleXpathOrOperation(xpath, context);
                            } else {
                                xpathResult = getValueFromXPath(context + xpath, xml);
                            }
                            model[key] = xpathResult;

                        } else {
                            var details = {};
                            if (key !== 'value') {

                                model[key] = details;

                            } else {
                                details = model;
                            }


                            recursiveParse(details, prop, context);
                        }
                    }
                }
            }

            function handleXpathOrOperationInContext(xpath, context) {
                var xpaths = xpath.split(" or "),
                    emptyResult = function (res) {
                        return !res || (res.constructor === Array && res.length === 0);
                    },
                    xpathResult = getValueFromXPath(context + xpaths[0], xml);

                // if empty result try othe path
                if (emptyResult(xpathResult)) {

                    return context + xpaths[1];


                }
                return context + xpaths[0];
            }

            function handleXpathOrOperation(xpath, context) {
                var xpaths = xpath.split(" or "),
                    emptyResult = function (res) {
                        return !res || (res.constructor === Array && res.length === 0);
                    },
                    xpathResult = getValueFromXPath(context + xpaths[0], xml);
                // if empty result try othe path
                if (emptyResult(xpathResult)) {

                    xpathResult = getValueFromXPath(context + xpaths[1], xml);

                }
                return xpathResult;
            }

            return isoModel;

        };

    return {

        buildIsoDoc: buildIsoDoc
    };
});