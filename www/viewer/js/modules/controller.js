/*jslint browser: true*/
/*global $, define, console */

define(['modules/model', 'text!templates/template.html', 'jquery', 'underscore'], function (model, rdView) {
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
                    position: ['center', 'center'],
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

                $("#my-message").html(
                    compiled_template(templateData)
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