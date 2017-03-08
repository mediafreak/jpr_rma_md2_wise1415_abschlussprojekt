/**
 * ==================================================
 * Javascript:    functions.js
 *
 * @author        Jenny Pilz
 * @date            2015/01
 *
 * @version        1.0
 * ================================================== */

/**
 * Enthaelt sozusagen Hilfsfunktionen
 * - getter
 * - setter
 */

var nav_header = '#filter',
    filter = nav_header+' a';

//noinspection JSUnusedGlobalSymbols
var aside_by_data = 'aside[data-other',
    div_by_data = 'div[data-other';

var liste = "#thumbnails",
    items = liste+' li',
    items_by_tags = {},
    button = liste+' button';

var current_link,
    current_link_name = 'Home';

var id = 0;
var darr_id_1 = 0;
var darr_id_2 = 0;


// Start JSON-Rendering
$(document).ready( function () {

    $.getScript("assets/js/content/xhr.js", function () {
        var config = "my_portfolio.json";
        remove_templates();
        json_rendering(config);
    });

});

function image_resize_position(image,width,height) {
    $(document).ready(function() {
        $(image).imageSize("init", {maxWidth: width, maxHeight: height, fade: true, fadeTime: 250});
    });
}

function resize_container() {
    var $container = $('#container');
    if ($container.height() > 330)
        $container.css('height', 330);
}

function set_curr_link(obj) {
    current_link = obj;
}

function set_curr_linkname(name) {
    current_link_name = name;
}

function set_document_title(name) {
    var site_title = (document.title).split('|');
    document.title = site_title[0] + "| " + name;
}

function set_darr_id(iD1, iD2) {
    darr_id_1 = iD1;
    darr_id_2 = iD2;
}

function set_id(iD) {
    id = iD
}
