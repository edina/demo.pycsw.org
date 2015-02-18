/*jslint browser: true*/
/*global $, define, console */

define(['modules/model', 'text!templates/template.html', 'jquery', 'underscore'], function (model, rdView) {
    'use strict';

    function isEmpty(el) {
        return !$.trim(el.html());

    }



    function hideRowsWithNoValues() {

        $("#record-details > div > table").each(function () {
            var allRowsHidden = true;
            $("tbody > tr > td:nth-child(2)", this).each(function () {

                var $this = $(this)
                if (isEmpty($this)) {

                    $this.parent().hide();
                } else {
                    allRowsHidden = false;
                }
            });
            if (allRowsHidden) {
                $(this).hide();
                $(this).prev().hide();
            }
        });
    }

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

                    $("#record-details").html(
                        compiled_template(templateData)
                    );
                    hideRowsWithNoValues();

                },
                error: function () {
                    alert("An error occurred while processing XML file.");
                }
            });


        },
        toggleTable = function (button) {
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
            };
        }



    return {
        showFullRecord: showFullRecord,
        toggleTable: toggleTable
    };

});