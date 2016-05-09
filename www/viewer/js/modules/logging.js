/*jslint browser: true*/
/*global $, L,define, console */
/*jslint plusplus: true */

define(['jquery', 'jqueryui'], function ($) {
  'use strict';


  var server = "http://unlock.edina.ac.uk/ws/",
    serverBaseUrl = '/gogeo-java/searchcsw.htm?',
    logSearch = function (searchTerms, numResults) {

      $.get("/gogeo-java/logging/logSearch.htm?searchTerm=" + searchTerms + "&numResults=" + numResults);
    },

    logAdvancedSearch = function (searchTerms, numResults) {

      $.get("/gogeo-java/logging/logAdvancedSearch.htm?searchTerm=" + searchTerms + "&numResults=" + numResults);
    },
    logRecordView = function (recordId, recordTitle) {
      $.get("/gogeo-java/logging/logViewRecord.htm?recordId=" + recordId + "&recordTitle=" + recordTitle);
    };

  return {
    logSearch: logSearch,

    logAdvancedSearch: logAdvancedSearch,

    logRecordView: logRecordView
  };


});