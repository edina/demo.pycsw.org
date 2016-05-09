/*jslint browser: true*/
/*jslint nomen: true */
/*global $, define, L, console, _ */

define(['modules/model', 'jquery', 'modules/view', 'text!templates/csw-query.txt', 'underscore'], function (model, $, view, cswQueryTemplate) {
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

      var getWmsCapabilities = $(p.button).attr('id'),
        getmap = getWmsCapabilities.split('?'),
        url = getmap[0];


      model.getWmsLayers(url, function (layers) {

        view.displayLayersPopup(layers, url);
        //show pop up



      });


    },

    addLayerToMap = function (p) {
      var layer = L.tileLayer.wms(p.wmsUrl, {
          layers: p.layerName,
          format: 'image/png',
          transparent: true
        }),
        mapHasBeenAdded = function () {
          var prop;
          for (prop in p.map_layers_control._layers) {
            if (p.name === p.map_layers_control._layers[prop].name) {
              return true;
            }
          }
          return false;
        };

      if (mapHasBeenAdded()) {
        return;
      }


      p.map_layers_control.addOverlay(layer, p.name);
      p.map.addLayer(layer);

    },
    viewIdUrlInWindow = function (url) {
      var win = window.open(url, '_blank');
      win.focus();
    },
    clearSearch = function () {
      view.clearSearch();
    },
    createCSWQuery = function (cswUrl, searchParams) {

      _.templateSettings.variable = "rc";
      var query = _.template(cswQueryTemplate),
        postData = query(searchParams),
        isAdvancedSearch = function () {
          return searchParams.topicCategory || searchParams.resourceType ||
            searchParams.catalogue || searchParams.dateFrom || searchParams.dateTo;

        };

      $.ajax({
        type: "POST",
        method: "POST",
        url: cswUrl,
        contentType: "text/xml",
        data: postData,
        dataType: "text",
        success: function (xmlResultSummary) {

          var summary = model.resultsSummary(xmlResultSummary, searchParams),
            cswRecords;
          summary.cswUrl = cswUrl;
          cswRecords = model.createRecordsModel(xmlResultSummary);
          view.displayResults(xmlResultSummary, summary, cswRecords);
        }
      });


    };


  return {
    showFullRecord: showFullRecord,
    toggleTable: toggleTable,
    addWmsToMap: addWmsToMap,
    addLayerToMap: addLayerToMap,
    viewIdUrlInWindow: viewIdUrlInWindow,
    createCSWQuery: createCSWQuery,
    clearSearch: clearSearch
  };

});