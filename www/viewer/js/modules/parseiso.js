/*jslint browser: true*/
/*global $, define, console */

define(['jquery', 'jqueryxpath', 'underscore'], function () {

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
    };


    var mappings = {
        "identifier": "gmd:fileIdentifier/gco:CharacterString",

        "language": "gmd:language/gmd:LanguageCode/@codeListValue",
        "keywords": "gmd:identificationInfo/gmd:MD_DataIdentification/gmd:descriptiveKeywords/gmd:MD_Keywords/gmd:keyword",
        "parentidentifier": "gmd:parentIdentifier/gco:CharacterString",
        "dataseturi": "gmd:dataSetURI/gco:CharacterString",
        "languagecode": "gmd:language/gmd:LanguageCode",
        "datestamp": "gmd:dateStamp/gco:Date or gmd:dateStamp/gco:DateTime",
        "charset": "gmd:characterSet/gmd:MD_CharacterSetCode/@codeListValue",
        "hierarchy": "gmd:hierarchyLevel/gmd:MD_ScopeCode/@codeListValue",
        "datetimestamp": "gmd:dateStamp/gco:DateTime"

    };


    var isoNamespaces = function (prefix) {
        var ns = namespaces[prefix];
        return ns;

    };

    function getValueFromXPath(path, xml) {

        var xpathResult = $(xml).xpath(path, isoNamespaces);
        var arr = [];
        xpathResult.each(function () {
            arr.push($.trim(this.textContent));

        });
        if (arr.length === 1) {
            return arr[0];
        } else {
            return arr;
        }

    }
    var buildIsoDoc = function (xml) {
        var MD_metadata_element = $(xml).xpath('/csw:GetRecordByIdResponse/gmd:MD_Metadata', isoNamespaces);
        var isoModel = {};
        for (var key in mappings) {
            console.log(key);
            console.log(mappings[key]);
            isoModel[key] = getValueFromXPath(mappings[key], MD_metadata_element);
        };
        return isoModel;

    };
    return {

        buildIsoDoc: buildIsoDoc
    };
});