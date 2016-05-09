/*jslint browser: true*/
/*jslint plusplus: true */
/*jslint nomen: true */
/*global $, define, console , L, _*/

define(['jquery', 'text!templates/recordtemplate.html', 'text!templates/layerstemplate.html', 'underscore'], function ($, recordDetailsTemplate, layersTemplate) {
  'use strict';

  function truncate(value, length) {
    if (value.length > length) {
      return value.substring(0, length) + '...';
    }
    return value;
  }


  function isEmpty(el) {
    return !$.trim(el.html());

  }

  function styleRecord(summary, rec) {
    var snippet = "<tr><td id='" + rec.bbox.csv + "' >",
      url = summary.cswUrl + "?service=CSW&version=2.0.2&request=GetRecordById&elementsetname=full&outputschema=http://www.isotc211.org/2005/gmd&id=" + rec.identifier,
      links = "",
      i,
      getCapabilitiesUrl,
      xmlRecordLink,
      shortCode;
    // get all links
    for (i = 0; i < rec.references.length; i++) {
      if (rec.references[i].value !== "None" && rec.references[i].value.lastIndexOf("http", 0) === 0) {

        if (rec.references[i].scheme === "OGC:WMS") {
          getCapabilitiesUrl = rec.references[i].value;
          links += '<button id="' + getCapabilitiesUrl + '" class="addWmsToMap">Add to map</button>';
        } else {
          shortCode = summary.protocolShortCode(rec.references[i].scheme);

          links += " <button title=" + rec.references[i].value + " class='viewIdUrlInWindow'  id='" + rec.references[i].value + "' >" + shortCode + "</button>";
        }
      }
    }



    snippet += '<strong>' + rec.title + '</strong>';
    snippet += '<p>' + truncate(rec.abstract, 255) + '</p>';
    if (rec.publisher) {
      snippet += '<em>' + rec.publisher + '</em><br/>';
    }
    xmlRecordLink = '<a id="' + rec.bbox.csv + '" class="a-record" target="_blank" title="' + rec.title + '" href="' + url + '">' + rec.title + '</a>';
    snippet += "<button class='showFullRecord' id='" + url + "' >Full Record</button><button class='viewIdUrlInWindow' id='" + url + "' >View Xml Record</button></br>";
    snippet += '<small><strong>Date</strong>: ' + rec.date + '</small><br/>';
    if (links) {
      snippet += 'Document Links ' + links;
    }
    snippet += '</td></tr>';
    return snippet;
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
        pinMap = function () {
          // Disable drag and zoom handlers.
          map.dragging.disable();
          map.touchZoom.disable();
          map.doubleClickZoom.disable();
          map.scrollWheelZoom.disable();

        },

        // create the tile layer with correct attribution
        osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        osmAttrib = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        osm = new L.TileLayer(osmUrl, {
          maxBounds: bounds,
          attribution: osmAttrib
        });


      map.addLayer(osm);
      map.fitBounds(bounds);
      pinMap();
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
    },
    displayLayersPopup = function (layersData, url) {
      layersData.wmsUrl = url;
      $("#layers-popup").dialog({
        modal: true,
        draggable: true,
        resizable: true,
        show: 'blind',
        hide: 'blind',
        width: 300,
        dialogClass: 'ui-dialog-osx',
        buttons: {
          "Close": function () {
            $(this).dialog("close");
          }
        }
      });

      $("#layers-popup").removeClass('hidden');
      _.templateSettings.variable = "rc";



      var compiled_template = _.template(layersTemplate);

      $("#layers-content").html(
        compiled_template(layersData)
      );

    },

    clearSearch = function () {

      $('#input-anytext, #dateFrom, #dateTo, #city').val('');
      $('#table-csw-results').empty();
      $('#select-topicCategory, #select-resourceType, #select-catalogue').val('');
      $('#select-topicCategory, #select-resourceType, #select-catalogue').selectmenu("refresh");

    },
    displayResults = function (xml, summary, cswRecords) {

      $('#table-csw-results').empty();
      $('#div-csw-results-glass').toggle();



      $('#input-startPosition').val(summary.startPosition);
      $('#input-nextrecord').val(summary.nextrecord);
      $('#input-matched').val(summary.matched);

      if (summary.matched === 0) {
        $('#div-results').html('');
        $('#table-csw-results').html('<tr><td>No results</td></tr>');
        return;
      } else {
        $('#div-csw-sort-results').show();
      }
      if (summary.moreRecords()) { // at the end
        $('#b-next').prop('disabled', true);
      } else {
        $('#b-next').prop('disabled', false);
      }
      if (summary.startPosition === 1) {
        $('#b-previous').prop('disabled', true);
      } else {
        $('#b-previous').prop('disabled', false);
      }

      var results = '<strong>Results ' + summary.startPosition + '-' + summary.nextrecord + ' of ' + summary.matched + ' record(s)</strong>';

      $('#div-results').html(results);

      $(cswRecords).each(function (record) {
        $("#table-csw-results").append(styleRecord(summary, this));
      });

      $('#div-csw-results').scrollTop(0);
    };



  return {
    displayRecordDetailsPopup: displayRecordDetailsPopup,
    expandCollapseTable: expandCollapseTable,
    displayLayersPopup: displayLayersPopup,
    displayResults: displayResults,
    clearSearch: clearSearch
  };
});