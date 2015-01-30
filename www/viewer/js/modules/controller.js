/*jslint browser: true*/
/*global $, define, console */

define(['modules/model', 'jquery'], function (model) {
    'use strict';

    var showFullRecord = function (url) {
        console.log(url);
        $.ajax({
            type: "GET",
            url: url,
            dataType: "xml",
            success: function (xml) {
                model.createRecordDetailsModel(xml);
            },
            error: function () {
                alert("An error occurred while processing XML file.");
            }
        });
    };

    return {
        showFullRecord: showFullRecord
    };

});