/*jslint browser: true*/
/*global $, define, L, console */

define(['modules/model', 'text!templates/template.html', 'jquery', 'underscore'], function (model, rdView) {
    'use strict';

    function isEmpty(el) {
        return !$.trim(el.html());

    }

    function addExtentMap(m) {
        if (m.identification.extent.boundingBox.minx && m.identification.extent.boundingBox.miny && m.identification.extent.boundingBox.maxx && m.identification.extent.boundingBox.maxy) {

            var southWest = L.latLng(parseFloat(m.identification.extent.boundingBox.miny), parseFloat(m.identification.extent.boundingBox.minx)),
                northEast = L.latLng(parseFloat(m.identification.extent.boundingBox.maxy), parseFloat(m.identification.extent.boundingBox.maxx)),
                bounds = L.latLngBounds(southWest, northEast);
            var map = new L.Map('extentMap'),

                // create the tile layer with correct attribution
                osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
                osm = new L.TileLayer(osmUrl, {
                    minZoom: 10,
                    maxZoom: 19,
                    maxBounds: bounds,
                    attribution: osmAttrib
                });

            // start the map in South-East England
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
                    addExtentMap(templateData);

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