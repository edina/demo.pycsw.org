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
                var templateData = model.createRecordDetailsModel(xml);

                $("#dialog-message").dialog({
                    modal: true,
                    draggable: false,
                    resizable: false,
                    position: ['center', 'top'],
                    show: 'blind',
                    hide: 'blind',
                    width: 400,
                    dialogClass: 'ui-dialog-osx',
                    buttons: {
                        "I've read and understand this": function () {
                            $(this).dialog("close");
                        }
                    }
                });
                $("#dialog-message").removeClass('hidden');
                _.templateSettings.variable = "rc";

                // Grab the HTML out of our template tag and pre-compile it.
                var template = _.template(
                    $("script.template").html()
                );


                $("#my-message").html(
                    template(templateData)
                );
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