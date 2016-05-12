/*jslint browser: true*/
/*global $, L,define, console */
/*jslint plusplus: true */

define(['modules/model', 'modules/controller', 'jquery', 'leaflet', 'jqueryui'], function (recordsModel, controller) {
  'use strict';
  var map, map_layers_control, cswUrl = "/pycsw-wsgi",
    polygon_layer, pageSize = 10,
    i;
  //cswUrl = 'http://localhost:8000/';

  function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }



  function bbox2polygon(bbox) {
    if (bbox === null) {
      return new L.Polygon();
    }
    var coords = bbox.split(','),
      p1 = new L.LatLng(coords[0], coords[1]),
      p2 = new L.LatLng(coords[2], coords[1]),
      p3 = new L.LatLng(coords[2], coords[3]),
      p4 = new L.LatLng(coords[0], coords[3]),
      polygonPoints = [p1, p2, p3, p4];
    return new L.Polygon(polygonPoints);
  }




  function zoomToArea(bb) {

    var southWest = L.latLng(bb[1], bb[0]),
      northEast = L.latLng(bb[3], bb[2]),
      bounds = L.latLngBounds(southWest, northEast);

    map.fitBounds(bounds);
    $('#input-bbox').prop('checked', true);
  }




  function search(startPosition) {
    var freetext = $('#input-anytext').val().trim(),
      bbox_enabled = $('#input-bbox').is(':checked'),
      topicCategory = $("#select-topicCategory").val(),
      bbox_within_enabled = $('#input-bbox_within').is(':checked'),
      dateFrom = $('#dateFrom').val(),
      dateTo = $('#dateTo').val(),
      qbbox,
      bb,
      bounds,
      spatialOperator,
      searchParams,
      validSearchOptions,
      sortBy = $("#select-sortBy").val(),
      resourceType = $("#select-resourceType").val(),
      catalogue = $("#select-catalogue").val(),
      numberOfSearchConstraints = function (searchOptions) {
        var i, len, numSearchOptions = 0;
        for (len = searchOptions.length, i = 0; i < len; i++) {
          searchOptions[i] && ++numSearchOptions;
        }
        return numSearchOptions;
      };
    $('#div-csw-results-glass').toggle();

    if (!startPosition) {
      startPosition = 1;
    }


    if (bbox_enabled && map) {
      bounds = map.getBounds();
      bb = {};
      bb.southWest = bounds.getSouth() + ' ' + bounds.getWest();
      bb.northEast = bounds.getNorth() + ' ' + bounds.getEast();

    }

    validSearchOptions = numberOfSearchConstraints([freetext, resourceType, catalogue, bbox_enabled, topicCategory, dateFrom, dateTo]);

    spatialOperator = bbox_within_enabled ? "Within" : "BBOX";
    searchParams = {
      "freetext": freetext,
      "hasConstraints": validSearchOptions > 0,
      "pageSize": pageSize,
      "startPosition": startPosition,
      "bb": bb,
      "hasMultipleConstraints": validSearchOptions > 1,
      "topicCategory": topicCategory,
      "spatialOperator": spatialOperator,
      "dateFrom": dateFrom,
      "dateTo": dateTo,
      "sortBy": sortBy,
      "catalogue": catalogue,
      "resourceType": resourceType
    };
    controller.createCSWQuery(cswUrl, searchParams);

  }
  $(document).ready(function () {
    //Request URL:http://unlock.edina.ac.uk/ws/search?callback=jsonp1443106316183&q=&limit=&timestamp=1443106343258&gazetteer=os&format=json&maxRows=15&count=no&name=Edin*
    var bb, validBoundingBox = function (bb) {
      return bb[0] !== bb[2] && bb[1] !== bb[3];
    };

    $("#city").autocomplete({
      source: function (request, response) {
        $.ajax({
          url: "http://unlock.edina.ac.uk/ws/search",
          dataType: "jsonp",
          data: {
            name: request.term + '*',
            format: 'json'
          },
          success: function (data) {
            var rows = [],
              features = data.features,
              label;
            $(features).each(function (i, feature) {
              label = feature.properties.name + ", " + feature.properties.country + " - " + feature.properties.featuretype;
              if (validBoundingBox(feature.bbox)) {
                rows.push({
                  feature: feature,
                  label: label,
                  value: feature.properties.name
                });
              }

            });
            response(rows);
          }
        });
      },
      minLength: 3,
      select: function (event, ui) {
        console.log(ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
        var bb = ui.item.feature.bbox;
        zoomToArea(bb);

        console.log(ui.item.feature);
      },
      open: function () {
        $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
      },
      close: function () {
        $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
      }
    });

    $(document).on('click', '.showFullRecord', function () {
      var fullRecordUrl = $(this).attr('id');
      controller.showFullRecord(fullRecordUrl);
    });

    $(document).on('click', '.viewIdUrlInWindow', function () {
      var url = $(this).attr('id');
      controller.viewIdUrlInWindow(url);
    });

    $(document).on('click', 'div.toggleTableButton', function () {

      controller.toggleTable(this);
    });

    $(document).on('click', '#search-button', function () {

      search();
    });

    $(document).on('click', '#clear-button', function () {

      controller.clearSearch();
    });


    $('#dateFrom,#dateTo').datepicker({
      changeMonth: true,
      changeYear: true,
      showButtonPanel: true,
      dateFormat: "yy-mm-dd"

    });

    $("#select-topicCategory, #select-resourceType, #select-catalogue").selectmenu({
      width: 200
    });

    $('#select-sortBy').selectmenu({
      width: 100
    });
/*
    $("#search-button, #b-previous, #b-next, #private-nodes, #clear-button")
      .button()
      .click(function (event) {
        event.preventDefault();
      });
*/
    $("#advanced-search-button").button({
      icons: {
        secondary: "ui-icon-triangle-1-s"
      }
    });

    $("#advanced-search-button").click(function () {
      if ($("#advanced-search-button").button("option", "icons").secondary === 'ui-icon-triangle-1-s') {
        $(".advanced-search-content").slideDown(400);
        $("#advanced-search-button").button("option", {
          icons: {
            secondary: "ui-icon-triangle-1-n"
          }
        });
      } else {
        $(".advanced-search-content").slideUp(500);
        $("#advanced-search-button").button("option", {
          icons: {
            secondary: "ui-icon-triangle-1-s"
          }
        });
      }
    });

    $(".viewIdUrlInWindow").tooltip();

    $('input:text').button().addClass('my-textfield-overides');

    $(".advanced-search-content").hide();
    map = L.map('div-map').setView([10, 0], 1);
    var basemap = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    map.addLayer(basemap);
    map_layers_control = L.control.layers({
      "basemap": basemap
    }, {}, {
      'collapsed': true,
      position: 'bottomleft'
    }).addTo(map);

    // handle CSW searches
    $("#input-anytext").keypress(function (e) {
      if (e.keyCode === 13) { // Enter key pressed, but not submitting the form to a page refresh
        search();
        return false;
      }
    });
    $('#b-previous').click(function (event) {
      event.preventDefault();
      var startPosition2 = $('#input-startPosition').val() - pageSize;
      if (startPosition2 < 1) {
        return;
      }
      search(startPosition2);
    });
    $('#b-next').click(function (event) {
      event.preventDefault();
      var nextrecord2 = parseInt($('#input-nextrecord').val(), 10),
        matched2 = parseInt($('#input-matched').val(), 10);
      if (nextrecord2 === 0 || nextrecord2 >= matched2) {
        return;
      }
      search(nextrecord2);
    });
    $(document).on("click", ".addWmsToMap", function (event) {
      var button = this,
        params = {
          'button': button,
          'map': map,
          'map_layers_control': map_layers_control
        };
      controller.addWmsToMap(params);

    });


    $('#select-sortBy').on('selectmenuchange', function () {
      search();
    });
    $('#private-nodes').click(function (event) {
      window.location.href = 'http://gogeo.edina.ac.uk/geonetwork/srv/eng/main.home';
    });

    $(document).on("click", ".addLayer", function (event) {
      var $button = $(this),
        params = {
          'layerName': $button.attr("data-layerName"),
          'wmsUrl': $button.attr("data-wmsUrl"),
          'name': $button.text(),
          'map': map,
          'map_layers_control': map_layers_control
        };


      controller.addLayerToMap(params);
      $button.prop('disabled', true);

    });
    $("table").on("mouseenter", "td", function (event) {
      var bbox = $(this).attr('id');
      if (polygon_layer && map.hasLayer(polygon_layer)) {
        map.removeLayer(polygon_layer);
      }
      if ($('#input-footprints').is(':checked')) {
        if (bbox) {
          polygon_layer = bbox2polygon(bbox);
          map.addLayer(polygon_layer);
        }
      }
    });


    if (getParameterByName('advanced') === 'true') {
      $(".advanced-search-content").slideDown(100);
      $("#advanced-search-button").button("option", {
        icons: {
          secondary: "ui-icon-triangle-1-n"
        }
      });
    }


    function doInitialSearchIfRequired() {
      var where = getParameterByName('where'),
        hasBBox = getParameterByName('bb0'),
        what = getParameterByName('what'),
        bb;

      if (what || where || hasBBox) {
        $('#input-anytext').val(what);
        $('#city').val(where);
        if (getParameterByName('bb0')) {
          bb = [getParameterByName('bb0'), getParameterByName('bb1'), getParameterByName('bb2'), getParameterByName('bb3')];
          zoomToArea(bb);
        }
        // init the results table with CSW results
        search();

      }
    }


    doInitialSearchIfRequired();

  });
});