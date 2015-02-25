/*jslint browser: true*/
/*global $, define, L, console */

define(['modules/model', 'text!templates/template.html', 'jquery', 'underscore'], function (model, rdView) {
    'use strict';

    function isEmpty(el) {
        return !$.trim(el.html());

    }

    function convertToFloats(arr) {
        return $.map(arr, function (n) {
            var point = parseFloat(n);

            if (isNaN(point)) {
                return null;
            } else {
                return point;
            }
        });
    }

    function addExtentMap(bb, divId) {

        var bbArr = [bb.miny, bb.minx, bb.maxy, bb.maxx];
        bbArr = convertToFloats(bbArr);

        if (bbArr.length !== 0) {

            var southWest = L.latLng(bbArr[0], bbArr[1]),
                northEast = L.latLng(bbArr[2], bbArr[3]),
                bounds = L.latLngBounds(southWest, northEast);
            var map = new L.Map(divId),

                // create the tile layer with correct attribution
                osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                osm = new L.TileLayer(osmUrl, {
                    minZoom: 10,
                    maxZoom: 19,
                    maxBounds: bounds,
                    attribution: osmAttrib
                });

            map.addLayer(osm);
            map.fitBounds(bounds);
        }
    }


    function hideRowsWithNoValues() {

        $("#record-details > div > table").each(function () {
            var allRowsHidden = true,
                $table = $(this);
            $("tbody > tr > td:nth-child(2)", this).each(function () {

                var $this = $(this);
                if (isEmpty($this)) {

                    $this.parent().hide();
                } else {
                    allRowsHidden = false;
                }
            });
            if (allRowsHidden) {

                $table.hide();
                $table.prev().hide();
            }
        });
    }

    var showFullRecord = function (url) {
            console.log(url);
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function (xml) {
                    var templateData = model.createRecordDetailsModel(xml);

                    $("#dialog-message").dialog({
                        modal: true,
                        draggable: false,
                        resizable: true,
                        show: 'blind',
                        hide: 'blind',
                        width: 800,
                        dialogClass: 'ui-dialog-osx',
                        buttons: {
                            "I've read and understand this": function () {
                                $(this).dialog("close");
                            }
                        }
                    });
                    $("#dialog-message").removeClass('hidden');
                    _.templateSettings.variable = "rc";



                    var compiled_template = _.template(rdView);

                    $("#record-details").html(
                        compiled_template(templateData)
                    );
                    hideRowsWithNoValues();
                    addExtentMap(templateData.identification.extent.boundingBox, 'extentMap');
                    addExtentMap(templateData.serviceidentification.bbox.boundingBox, 'serviceExtentMap');

                },
                error: function () {
                    console.log("An error occurred while processing XML file.");
                }
            });


        },
        toggleTable = function (button) {
            var downArrowClass = "tgDown",
                rightArrowClass = "tgRight",
                table = $(button).parent().next();

            table.toggle();

            if ($(button).hasClass(downArrowClass)) {
                $(button).removeClass(downArrowClass);
                $(button).addClass(rightArrowClass);
            } else {
                $(button).removeClass(rightArrowClass);
                $(button).addClass(downArrowClass);
            }
        };



    return {
        showFullRecord: showFullRecord,
        toggleTable: toggleTable
    };

});