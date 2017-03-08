/**
 * ==================================================
 * Javascript:    overlay.js
 *
 * @author        Jenny Pilz
 * @date        2015/01
 *
 * @version        1.0
 * ================================================== */

/*
 * Overlay-Loesung fuer Lightbox-Effekt
 * Unterstützt:
 * - Video
 * - Image
 * - HTML
 * - SWF
 * - Canvas
 *
 * Denkbar wäre auch noch PDF über Canvas.
 *
 */

(function () {
    var $ = jQuery;

    $.fn.overlay = function(mode) {
        ////console.log('Overlay', mode);
        if (!mode) mode = "display";

        switch (mode) {
            case "display":
                set_light_box('display');
                break;
            case "canvas":
                set_light_box('canvas');
                break;
            case "none":
                clear_light_box('none');
                break;
            case "update":
                update_lightbox_frame();
                break;
        }
    };


    /*----------------------------
     Set Lightbox-Elements
     -----------------------------*/

    /**
     * Lightbox
     * @param mode - string
     */
    function set_light_box(mode) {

        var lb_thumbnails = '#lb_thumbnails';
        var light_box = '#light_box';

        if ($(light_box).length === 0) {

            var section = $('<section>');
            var div = $('<div>');

            set_background_wrapper(section, div);

            //var data = json_content[id].content_items[0].content[darr_id_1].detail[darr_id_2];
            var data = detail_array[darr_id_1][0];
            //console.log(detail_array[darr_id_2][0].mediatype,data.mediatype);

            switch (data.mediatype) {
                case "video":
                    ////console.log(mode);
                    if (mode != 'canvas') {
                        set_video_view(light_box, div, section, 984, 554, null);
                    } else {
                        set_video_view(light_box, div, section, 340, 191, 'canvas');
                        set_canvas_view(light_box, div, section, 340, 191, 'video')
                    }
                    break;

                case "image":
                    //console.log(mode);
                    if (mode != 'canvas') {
                        set_image_view(light_box, div, section);
                    } else {
                        set_image_view(light_box, div, section, 340, 210);
                        set_canvas_view(light_box, div, section, 340, 210, 'image')
                    }
                    break;
                case "html":
                    if (mode != 'canvas') {
                        set_text_view(light_box, div, section);
                    } else {
                        alert('Für Textelemente gibt es keine Pixelmanipulation');
                    }
                    break;
                case "swf":
                    if (mode != 'canvas') {
                        set_swf_view(light_box, div, section);
                    } else {
                        alert('Für swf-Dateien gibt es keine Pixelmanipulation');
                    }
                    break;
            }
            section.fadeIn(300);
            div.fadeIn(850);
        }
    }

    /**
     * Delete Lightbox
     */
    function clear_light_box() {
        var $body = $('body');
        $body.children('#light_box').fadeOut(300, function () {
            $body.children('#light_box').remove();
        });
        $body.children('#overlay').fadeOut(950, function () {
            $body.children('#overlay').remove();
        });
    }

    /**
     * The dark overlay
     * @param section
     * @param div
     */
    function set_background_wrapper(section, div) {
        $(section).attr({
            "id": 'overlay',
            "className": 'overlay_bg',
            "class": 'overlay_bg'
        });

        $(section).css('display', 'none');

        $(div).attr('id', 'light_box');
        $(div).css('display', 'none');
    }

    /**
     * The grey light box frame
     * @param light_box
     * @param width
     * @param height
     */
    function set_lightbox_frame(light_box, width, height) {

        $(light_box).css('height', height);
        $(light_box).css('width', width);

        if (detail_array.length > 1 && $('#zurpre').css('position') == undefined) {

            set_lightbox_navigation(light_box, width, height);
        }
    }

    /**
     * Light box navigation for multi pictures
     * @param light_box
     * @param width
     * @param height
     */
    function set_lightbox_navigation(light_box, width, height) {
        //console.log('lighbox nav');
        var margin_top = parseInt(height) / 2 - 20 + 'px';
        var margin_right = parseInt(width) + 15 + 'px';

        var divvor = $('<div>');
        var imgvor = $('<img>');
        var divzurueck = $('<div>');
        var imgzurueck = $('<img>');
        $(divvor).attr({
            "id": 'vorpre'
        });
        $(divzurueck).attr({
            "id": 'zurpre'
        });
        $(divvor).css({
            "position": 'absolute',
            'margin-left': margin_right,
            'top': margin_top,
            'cursor': 'e-resize'
        });
        $(divzurueck).css({
            "position": 'absolute',
            'margin-left': '-40px',
            'top': margin_top,
            'cursor': 'w-resize'
        });
        $(imgvor).attr('src', 'assets/img/pict/arrow_vor.svg');
        $(imgvor).css({
            "width": '23px',
            "height": "29px"
        });
        $(imgzurueck).attr('src', 'assets/img/pict/arrow_back.svg');
        $(imgzurueck).css({
            "width": '23px',
            "height": "29px"
        });
        $(imgvor).appendTo(divvor);
        $(imgzurueck).appendTo(divzurueck);
        $(divzurueck).appendTo(light_box);
        $(divvor).appendTo(light_box);
    }

    /**
     * Update dimensions of light box frame
     */
    function update_lightbox_frame() {
        console.log('update_lightbox_frame');
        if ($('#canvas_orig').length == 0) {
            var $precontent = $('.precontent');
            var $light_box = $('#light_box');

            var height = $precontent.height() + 30;
            var width = $precontent.width();

            $light_box.css('height', height);
            $light_box.css('width', width);
            var margin_top = parseInt(height) / 2 - 20 + 'px';
            var margin_right = parseInt(width) + 15 + 'px';
            $('#vorpre').css({
                'margin-left': margin_right,
                'top': margin_top
            });
            $('#zurpre').css({
                'margin-left': '-40px',
                'top': margin_top
            });
        } else {
            canvas.clear_rect();
        }
    }

    /**
     * Delete navigation elements in lightbox
     */
    function update_lightbox_navpos(width, height) {
        var margin_top = parseInt(height) / 2 - 20 + 'px';
        var margin_right = parseInt(width) + 15 + 'px';

        $('#vorpre').css({
            'margin-left': margin_right,
            'top': margin_top
        });
        $('#zurpre').css({
            'margin-left': '-40px',
            'top': margin_top
        });
    }

    /**
     * All elements added on the body
     * @param elem_tag
     * @param div
     * @param section
     */
    function added_to_body(elem_tag, div, section) {
        $(elem_tag).appendTo(div);

        var $body = $('body');
        $(section).appendTo($body);
        $(div).appendTo($body);
    }


    /*----------------------------
     View sets
     -----------------------------*/

    /**
     * Video view
     * @param light_box
     * @param div
     * @param section
     * @param width
     * @param height
     * @param method
     */
    function set_video_view(light_box, div, section, width, height, method) {
        var data = detail_array[darr_id_1][0];
        var elem_tag = $('<video>');
        $(elem_tag).attr({
            "controls": 'controls',
            "width": width + 'px',
            "height": height + 'px',
            "id": 'video',
            "class": 'precontent',
            "poster": data.stand
        });
        $(elem_tag).text('Your browser does not support the video tag');

        var filem = (data.src).split('.');
        var source_ogg = $('<source>');
        var source_mp4 = $('<source>');
        $(source_ogg).appendTo(elem_tag);
        $(source_mp4).appendTo(elem_tag);
        set_video_attributes($(source_ogg), filem[0] + '.ogv', 'video/ogg');
        set_video_attributes($(source_mp4), filem[0] + '.mp4', 'video/mp4');

        added_to_body(elem_tag, div, section);

        set_title(div);

        var vid = document.getElementById("video");
        if (method == 'canvas') vid.addEventListener("loadeddata", videoloaded);

        function videoloaded() {
            check_and_init_canvas('video', width, height);
            update_lightbox_navpos(width, height);
            removeHandler()
        }

        function removeHandler() {
            vid.removeEventListener("loadeddata", videoloaded);
        }

        set_lightbox_frame(light_box, width + 'px', height + 30 + "px");
    }

    /**
     * Hilfsfunktion für set_video_view
     *
     * @param obj
     * @param source
     * @param format
     */
    function set_video_attributes(obj, source, format) {
        obj.attr({"src": source, "class": format});
    }

    /**
     * Image view
     * @param light_box
     * @param div
     * @param section
     * @param width
     * @param height
     */
    function set_image_view(light_box, div, section, width, height) {
        var elem_tag = $('<img>');
        var elem = ' img';
        var data = detail_array[darr_id_1][0];
        var new_width;
        var new_height;
        $(elem_tag).attr({
            "src": data.src,
            "class": 'precontent',
            "id": 'image'
        });
        console.log(data.src, "set_image_view");
        $(elem_tag).load(function () {
            if ($('#zurpre').css('position') == undefined) {
                set_title(div);
                //if (width == null && height == null) {
                var $elem = $(light_box + elem);
                new_width = $elem.css('width');
                new_height = ( parseInt($elem.css('height')) + 30 ) + "px";
                set_lightbox_frame(light_box, new_width, new_height);
            } else {
                if (width && height && $('figure#original').length == 0) {

                    $(elem_tag).wrap('<figure id="original">');
                    $('figure#original').css({
                        "width": width,
                        "height": height
                    });

                    set_title(div);
                    update_lightbox_navpos(width, height);
                    check_and_init_canvas('image');
                }
            }
        });
        added_to_body(elem_tag, div, section);
    }

    /**
     * HTML view
     * @param light_box
     * @param div
     * @param section
     */
    function set_text_view(light_box, div, section) {
        var elem_tag = $('<p>');
        var elem = ' p';
        var data = detail_array[darr_id_1][0];
        $(elem_tag).css('width', '510px');
        $(elem_tag).css('height', 'auto');
        $(elem_tag).attr('id', 'text');
        $(elem_tag).attr('class', 'precontent');
        $(elem_tag).load(data.src, function () {
            //set_title(light_box, div);
            if ($('#zurpre').css('position') == undefined) {
                var $elem = $(light_box + elem);
                var width = $elem.css('width');
                var height = ( parseInt($elem.css('height')) + 30 ) + "px";
                set_lightbox_frame(light_box, width, height);
            }
        });
        added_to_body(elem_tag, div, section);
    }

    /**
     * SWF view
     * @param light_box
     * @param div
     * @param section
     */
    function set_swf_view(light_box, div, section) {
        var elem_tag = $('<div>');

        $(elem_tag).attr({
            'id': 'flashcontent',
            'class': 'precontent'
        });

        $(elem_tag).css({
            'width': '800px',
            'height': '600px'
        });

        set_title(div);
        added_to_body(elem_tag, div, section);

        var data = detail_array[darr_id_1][0];
        $(document).ready(
            function () {
                set_lightbox_frame(light_box, 800, 630);
                $('#flashcontent').flash(
                    {
                        swf: data.src,
                        // these arguments will be passed into the flash document
                        flashvars: {
                            swf: data.src
                        }
                    }
                );
                $('object').attr({
                    "width": 800,
                    "height": 600
                })
            }
        );
    }

    /**
     * Title of the view content
     * @param div
     */
    function set_title(div) {
        var data = detail_array[darr_id_1][0];
        var p = $('<p>' + data.desc + '</p>');
        $(p).attr('id', 'desc');
        $(p).appendTo(div);
    }


    /*----------------------------
     Canvas set
     -----------------------------*/

    /**
     * The View
     * @param light_box
     * @param div
     * @param section
     * @param width
     * @param height
     * @param method
     */
    function set_canvas_view(light_box, div, section, width, height, method) {
        console.log("set_canvas_view", method);

        var new_width = width + "px";
        var new_height = height * 2 + 65 + "px";

        //set_canvas_stages( [ 'orig', 'effect' ] );
        var warn = 'Your browser does not support the HTML 5 Canvas.';
        var elem_tag = $('<canvas>');
        $(elem_tag).attr({
            'width': width + 'px',
            'height': height + 'px',
            'id': 'canvas_orig'
        });
        $(elem_tag).text(warn);
        $(elem_tag).appendTo(div);

        if (method == 'video') {
            var elem_tag1 = $('<canvas>');
            $(elem_tag1).attr({
                'width': width + 'px',
                'height': height + 'px',
                'id': 'canvas_eff'
            });
            $(elem_tag1).text(warn);
            new_height = height * 3 + 70 + "px";
        }

        var h2 = $('<h2>Experimentelle Canvas-Bühne</h2>');
        $(h2).appendTo(div);

        var pult = $('<div id="pult">');
        create_canvas_pult(pult, width);

        added_to_body(elem_tag1, div, section);

        var $video = $('video');
        var $videosiborig = $('video ~ canvas#canvas_orig');

        if ($videosiborig) {
            $video.css('margin-top', '25px');
            $videosiborig.css('margin-top', $video.height() + 32);
        }

        set_lightbox_frame(light_box, new_width, new_height);

        $(pult).appendTo(div);
    }

    function create_canvas_pult(pult, width) {
        console.log("create_canvas_pult");
        $(pult).css({
            'width': width / 2 + 'px',
            'left': '-' + width / 2 - 50 + "px"
        });

        var brightness_btn = '<input id="brightness_btn" value="Brightness" type="button">';
        var contrast_btn = '<input id="contrast_btn" value="Contrast" type="button">';
        var grayscale_btn = '<input id="grayscale_btn" value="Grayscale" type="button">';
        var invert_btn = '<input id="invert_btn" value="Invert" type="button">';
        var noise_btn = '<input id="noise_btn" value="Noise" type="button">';
        var saturate_btn = '<input id="saturate_btn" value="Saturate" type="button">';
        var sepia_btn = '<input id="sepia_btn" value="Sepia" type="button">';
        var reset_btn = '<input id="reset_btn" value="Reset" type="button">';

        $(brightness_btn).appendTo(pult);
        $(contrast_btn).appendTo(pult);
        $(grayscale_btn).appendTo(pult);
        $(invert_btn).appendTo(pult);
        $(noise_btn).appendTo(pult);
        $(saturate_btn).appendTo(pult);
        $(sepia_btn).appendTo(pult);
        $(reset_btn).appendTo(pult);
    }

    /**
     * Init when a successful response is detected
     * @param medium
     * @param width
     * @param height
     */
    function check_and_init_canvas(medium) {
        $.when(
            $.getScript("assets/js/canvas.js"),
            $.getScript("assets/js/effects.js"),
            $.Deferred(function (deferred) {
                $(deferred.resolve);
            })
        ).done(function () {
                canvas.init_canvas();
                switch (medium) {
                    case "video":
                        canvas.copy_video();
                        break;
                    case "image":
                        canvas.copy_image();
                        break;
                }
            });
    }
}).call();