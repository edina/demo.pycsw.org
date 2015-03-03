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
        };



    return {
        showFullRecord: showFullRecord,
        toggleTable: toggleTable
    };

});