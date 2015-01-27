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
                $(xml).find('Book').each(function () {
                    var sTitle = $(this).find('Title').text();
                    var sPublisher = $(this).find('Publisher').text();
                    $("<li></li>").html(sTitle + ", " + sPublisher).appendTo("#dvContent ul");
                });
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