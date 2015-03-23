/*jslint browser: true*/
/*global $, define, L, console */

define(['modules/model', 'jquery', 'modules/view'], function (model, $, view) {
    'use strict';


    var showFullRecord = function (url) {
            console.log(url);
            $.ajax({
                type: "GET",
                url: url,
                dataType: "xml",
                success: function (xml) {
                    var templateData = model.createRecordDetailsModel(xml);

                    view.displayRecordDetailsPopup(templateData);
                },
                error: function () {
                    console.log("An error occurred while processing XML file.");
                }
            });


        },
        toggleTable = function (button) {
            view.expandCollapseTable(button);
        },
        addWmsToMap = function (p) {


            var tokens = $(p.button).attr('id').split('##');
            var getWmsCapabilities = $(p.button).attr('id');
            var getmap = getWmsCapabilities.split('?');
            var url = getmap[0];


            model.getWmsLayers(getWmsCapabilities, function (layers) {

                view.displayLayersPopup();
                //show pop up
                /*
                var layer_name = "0";
                var layer = L.tileLayer.wms(url, {
                    layers: layer_name,
                    format: 'image/png',
                    transparent: true
                });
                p.map_layers_control.addOverlay(layer);
                p.map.addLayer(layer);*/

            });
            /*
            var getmap_kvp = getmap[1].split('&');;
            for (var i = 0; i < getmap_kvp.length; i++) {
                var temp = getmap_kvp[i].toLowerCase();
                if (temp.search('layers') != -1) {
                    var kvp = getmap_kvp[i].split('=');
                    var layer_name = kvp[1];
                }
            }

            for (var prop in map_layers_control._layers) {
                if (url == map_layers_control._layers[prop].layer._url && tokens[1] == map_layers_control._layers[prop].name) {
                    return;
                }
            }
            */



        };




    return {
        showFullRecord: showFullRecord,
        toggleTable: toggleTable,
        addWmsToMap: addWmsToMap
    };

});