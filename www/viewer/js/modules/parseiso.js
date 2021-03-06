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




        isoNamespaces = function (prefix) {
            var ns = namespaces[prefix];
            return ns;

        },

        getValueFromXPathSimple = function (path, xml) {

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

        getValueFromXPath = function (cxt, $xml, xpathFromCtx) {

            cxt = cxt.slice(0, -1);

            var elems = $xml.xpath(cxt, isoNamespaces);
            var b = [];
            for (var i = 0; i < elems.length; i++) {
                var res = $(elems[i]).xpath(xpathFromCtx, isoNamespaces);
                var arr = [];

                res.each(function (index) {
                    arr[index] = ($.trim(this.textContent));
                });
                console.log(res);
                if (arr.length === 1) {
                    b[i] = arr[0];
                } else {
                    b[i] = arr;
                }
            }
            return b;


        },

        buildIsoDoc = function (xml) {
            var isoModel = {},
                xpathOr = " or ",
                $xml = $(xml);
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
                            if (key == 'uuidref') {
                                console.log(key);
                            }

                            if (!isObject(prop)) {
                                var xpath = map[key];


                                var xpathResult = getValueFromXPath(context, $xml, xpath);
                                console.log(xpath);


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
                //pain test expression has an 'OR' operator as it doesn't work in this impl
            function handleXpathOrOperationInContext(xpath, context) {
                var xpaths = xpath.split(" or "),
                    emptyResult = function (res) {
                        return !res || (res.constructor === Array && res.length === 0);
                    },
                    xpathResult = getValueFromXPathSimple(context + xpaths[0], xml);

                // if empty result try other path
                if (emptyResult(xpathResult)) {

                    return context + xpaths[1];


                }
                return context + xpaths[0];
            }

            return isoModel;

        };

    return {

        buildIsoDoc: buildIsoDoc
    };
});