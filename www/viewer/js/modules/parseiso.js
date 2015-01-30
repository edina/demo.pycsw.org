/*jslint browser: true*/
/*global $, define, console */

define(['jquery', 'jqueryxpath'], function () {

    var namespaces = {
        None: 'http://www.isotc211.org/2005/gmd',
        'gco': 'http://www.isotc211.org/2005/gco',
        'gmd': 'http://www.isotc211.org/2005/gmd',
        'gml': 'http://www.opengis.net/gml',
        'gml32': 'http://www.opengis.net/gml/3.2',
        'gmx': 'http://www.isotc211.org/2005/gmx',
        'gts': 'http://www.isotc211.org/2005/gts',
        'srv': 'http://www.isotc211.org/2005/srv',
        'xlink': 'http://www.w3.org/1999/xlink'
    };

    var mappings = {
        "identifier": "gmd:fileIdentifier/gco:CharacterString",
        "parentidentifier": "gmd:parentIdentifier/gco:CharacterString",
        "language": "gmd:language/gco:CharacterString",
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

        var val = $(xml).xpath(path, isoNamespaces);
        if (val) {
            return val.text();
        }

    }
    var buildIsoDoc = function (xml) {
        var isoModel = {};
        for (var key in mappings) {
            console.log(key);
            console.log(mappings[key]);
            isoModel[key] = getValueFromXPath("//" + mappings[key], xml);
        };
        console.log(isoModel);

    };
    return {

        buildIsoDoc: buildIsoDoc
    };
});