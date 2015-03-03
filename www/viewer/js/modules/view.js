/*jslint browser: true*/
/*global $, define, console , L*/

define(['jquery', 'text!templates/template.html', 'underscore'], function ($, recordDetailsTemplate) {
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

    function displayMap(bb, divId) {

        var bbArr = [bb.miny, bb.minx, bb.maxy, bb.maxx];
        bbArr = convertToFloats(bbArr);

        if (bbArr.length !== 0) {

            var southWest = L.latLng(bbArr[0], bbArr[1]),
                northEast = L.latLng(bbArr[2], bbArr[3]),
                bounds = L.latLngBounds(southWest, northEast),
                map = new L.Map(divId),

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

        $("#record-details-content > div > table").each(function () {
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


    var displayRecordDetailsPopup = function (templateData) {

            $("#record-details-popup").dialog({
                modal: true,
                draggable: false,
                resizable: true,
                show: 'blind',
                hide: 'blind',
                width: 800,
                dialogClass: 'ui-dialog-osx',
                buttons: {
                    "Close": function () {
                        $(this).dialog("close");
                    }
                }
            });
            $("#record-details-popup").removeClass('hidden');
            _.templateSettings.variable = "rc";



            var compiled_template = _.template(recordDetailsTemplate);

            $("#record-details-content").html(
                compiled_template(templateData)
            );
            hideRowsWithNoValues();

            displayMap(templateData.identification.extent.boundingBox, 'extentMap');
            displayMap(templateData.serviceidentification.bbox.boundingBox, 'serviceExtentMap');
        },
        expandCollapseTable = function (button) {
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
        displayRecordDetailsPopup: displayRecordDetailsPopup,
        expandCollapseTable: expandCollapseTable
    };
});