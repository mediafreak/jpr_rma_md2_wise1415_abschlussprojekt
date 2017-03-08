/**
 * ==================================================
 * Javascript:    events.js
 *
 * @author        Jenny Pilz
 * @date            2015/01
 *
 * @version        1.0
 * ================================================== */

/**
 * Enthaelt die Mouseevents des gesamten Portfolio
 */

$(document).ready(function () {

    /*-------------------------------------------
     Mouse-EventListener Navigation
     --------------------------------------------*/

    // Alle Liste-Elemente durchlaufen und checken, ob zu aktuellem Tag zugehoerig
    //$(filter).mouseenter(function(e) {
    $(document).on('click', filter, function (e) {
        set_curr_link($(this));
        set_curr_linkname( current_link.text() );
        set_document_title(current_link_name);
        create_thumbnails();
        resize_container();
        e.preventDefault();
    });

    // MouseOnclick-Event-Listener fuer Listen-Punkt
    $(document).on('click', items, function (e) {
        set_id($("li").index(this));
        set_curr_linkname( $(this).attr('data-tags') );
        set_document_title(current_link_name);
        create_content();
        e.preventDefault();
    });

    /*-------------------------------------------
     Mouse-EventListener Thumbnails
     --------------------------------------------*/

    $(document).on('mouseover', button, function (e) {
        var button_status = $(this).attr('class');
        if (button_status != "active")
            btn_active($(this).find('img'));
        e.preventDefault();
    });

    $(document).on('mouseleave', button, function (e) {
        var button_status = $(this).attr('class');
        if (button_status != "active")
            btn_inactive($(this).find('img'));
        e.preventDefault();
    });

    /*-------------------------------------------
     Mouse-EventListener Detailansicht
     --------------------------------------------*/

    $('#vor').mousedown(function (e) {
        set_darr_id(0, darr_id_2);
        if (id < number_of_child_thumb - 1) id++;
        else set_id(0);
        create_content();
        e.preventDefault();
    });

    $('#zurueck').mousedown(function (e) {
        set_darr_id(0,darr_id_2);
        if (id > 0) id--;
        else set_id(number_of_child_thumb - 1) ;
        create_content();
        e.preventDefault();
    });

    $('#start').mousedown(function (e) {
        set_darr_id(0,darr_id_2);
        set_document_title(current_link_name);
        create_thumbnails();
        resize_container();
        e.preventDefault();
    });

    $('#effects').mousedown(function (e) {
        $(this).overlay('canvas');
        e.preventDefault();
    });

    $(document).on('click', '#preview', function (e) {
        $(this).overlay('display');
        e.preventDefault();
    });

    $(document).on('mouseover', '#preview', function (e) {
        if (document.getElementById('lupe') === null) {
            var img = $('<img id="lupe" src="assets/img/pict/lupe.svg" />');
            $(img).appendTo('figure');
        }
        e.preventDefault();
    });

    $(document).on('mouseleave', '#preview', function (e) {
        $('figure').find('#lupe').remove();

        e.preventDefault();
    });

    $(document).on('click', '#lb_thumbnails a', function (e) {
        update_preview(this);

        set_darr_id($(this).parent().index(), 0);

        var mod = detail_length / task_length;

        if (detail_length > 1 && task_length > 1 && mod == 1)
            update_task();

        e.preventDefault();
    });


    /*-------------------------------------------
     Mouse-EventListener Lightbox
     --------------------------------------------*/

    $(document).on('click', '#overlay', function (e) {
        $(this).overlay('none');
        set_darr_id(1, 0);
        e.preventDefault();
    });

    $(document).on('click', '#zurpre', function (e) {
        if (detail_array[darr_id_1].length > 1) {
            if (darr_id_2 > 0) darr_id_2--;
            else set_darr_id(darr_id_1,detail_array[darr_id_1].length - 1);
        } else {
            if (darr_id_1 > 0) darr_id_1--;
            else set_darr_id(detail_array.length - 1,darr_id_2);
        }
        update_lightbox_content();
        e.preventDefault();
    });

    $(document).on('click', '#vorpre', function (e) {
        //console.log(detail_array[darr_id_1].length);
        if (detail_array[darr_id_1].length > 1) {
            if (darr_id_2 < detail_array[darr_id_1].length - 1) darr_id_2++;
            else set_darr_id(darr_id_1,0);
        } else {
            if (darr_id_1 < detail_array.length - 1) darr_id_1++;
            else set_darr_id(0,darr_id_2);
        }
        update_lightbox_content();
        e.preventDefault();
    });


    /*-------------------------------------------
     Mouse-EventListener Effekte
     --------------------------------------------*/

    $(document).on('click', '#brightness_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.brightness();
        } else {
            canvas.set_filter('brightness');
        }
        e.preventDefault();
    });

    $(document).on('click', '#contrast_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.contrast();
        } else {
            canvas.set_filter('contrast');
        }
        e.preventDefault();
    });
    $(document).on('click', '#grayscale_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.grayscale();
        } else {
            canvas.set_filter('grayscale');
        }
        e.preventDefault();
    });

    $(document).on('click', '#invert_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.invert();
        } else {
            canvas.set_filter('invert');
        }
        e.preventDefault();
    });
    $(document).on('click', '#noise_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.noise();
        } else {
            canvas.set_filter('noise');
        }
        e.preventDefault();
    });
    $(document).on('click', '#saturate_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.saturate();
        } else {
            canvas.set_filter('saturate');
        }
        e.preventDefault();
    });
    $(document).on('click', '#sepia_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.sepia();
        } else {
            canvas.set_filter('sepia');
        }
        e.preventDefault();
    });
    $(document).on('click', '#reset_btn', function (e) {
        if (document.getElementById('original')) {
            canvas.reset();
        } else {
            canvas.set_filter('reset');
        }
        e.preventDefault();
    });
});


/*-------------------------------------------
 Hilfsfuntionen für Hover-Elemente in Grid of Equals
 --------------------------------------------*/

function btn_active(elem) {
    var thumbname = elem.attr('src').split('.');
    var thumbactive = thumbname[0] + "_active.png";
    elem.attr("src", thumbactive);
}

function btn_inactive(elem) {
    var thumbname = elem.attr('src');
    var thumbinactive = thumbname.substring(0, thumbname.lastIndexOf('_')) + ".png";
    ////console.log(thumbinactive);
    elem.attr("src", thumbinactive);
}
