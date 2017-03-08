/**
 * ==================================================
 * Javascript:    jsr.js
 *
 * @author        Jenny Pilz
 * @date        2015/01
 *
 * @version        1.0
 * ================================================== */

/*
 * Liest die Inhalte aus JSON-Objekt aus und
 * stellt sie im Browser zur Verfuegung bzw. dar
 *
 */

var detail_template;
var task_template;
var thumbnails_template;
var detail_array;
var detail_width = 470;
var space = 10;
var task_title;
var detail_length;
var task_length;



/**
 * Liest Templates für Content aus und entfernt diese aus DOM
 */
function remove_templates() {

    detail_template = read_remove_template("detail-template",null);
    detail_template.removeAttribute("class");
    task_template = read_remove_template("task-template",null);
    task_template.removeAttribute("class");
    thumbnails_template = read_remove_template("thumbnails_template",null);
    thumbnails_template.removeAttribute("class");
}

/**
 * Erzeugt Thumbnails
 */
function create_thumbnails() {

    var root_element = $('#thumbnails')[0];
    var content_item = json_content.length;

    /* nur erzeugen, wenn noch keine Thumbnails erzeugt */
    if( root_element.children.length == 0) {
        for (var i = 0; i < content_item; i++) {
            var current_li_element = thumbnails_template.cloneNode(true);

            $(current_li_element).attr("data-tags", json_content[i].tags);

            var button  = $('<button>');
            var img     = $('<img>');
            var strong  = $('<strong>');
            var title   = json_content[i].title;

            $(button).appendTo( current_li_element );
            $(button).attr({
                "name" : json_content[i].tags,
                "type" : "button"
            });

            $(strong).appendTo( button );
            $(strong).text( title );

            $(img).appendTo( button );
            $(img).attr({
                "src" : json_content[i].thumbnail,
                "alt" : title
            });

            $(current_li_element).appendTo( root_element );
        }
    } else {
        $('#detailview').css("display", 'none');
        var trim_curr_link = current_link_name.replace(/\s+/g, '');
        set_curr_link($(filter + "[id='" + trim_curr_link + "']"));

        update_thumbnails();
    }
}

/**
 * Thumbnails zu Tag hervorheben
 */
function update_thumbnails() {
    $(liste).css('display','inherit');

    //Aktueller Menuepunkt aktiv, all anderen inaktiv
    current_link.addClass('active').siblings().removeClass('active');

    var all_button_items = $(items+" button");
    var all_image_items = $(items+" img");
    var all_paragraph_items = $(items+" p");

    var button_items_by_tags = $(items + "[data-tags='" + current_link_name + "'] button");
    var image_items_by_tags = $(items + "[data-tags='" + current_link_name + "'] img");
    var strong_items_by_tags = $(items + "[data-tags='" + current_link_name + "'] p");

    // Checke, ob Listen-Elemente (Image/Paragraph) bereits auf aktiv, wenn ja zurücksetzen
    all_paragraph_items.removeClass('active');
    all_button_items.removeClass('active');

    all_image_items.each(function () {
        if ($(this).attr('src').match(/_active.png/)) {
            btn_inactive($(this));
        }
    });

    // Listen-Elemente mit Tags des Menuepunkts auf aktiv setzen
    strong_items_by_tags.addClass('active');
    button_items_by_tags.addClass('active');

    image_items_by_tags.each(function () {
        btn_active($(this));
    });
}

/**
 * Liest Daten aus JSON, die auf detail und task hoeren
 */
function create_content() {
    $(liste).css('display','none');
    var $detailview = $('#detailview');
    $detailview.css("display", 'inherit');
    $detailview.attr('data-other',id);

    task_title = json_content[id].title;
    set_curr_linkname(json_content[id].tags);

    set_document_title(current_link_name);

    if( document.getElementById( "detail" ) ) {
        read_remove_template(null,"detail");
        read_remove_template(null,"task");
    }

    var emptyDetail = true;
    var emptyTask = true;
    var content_areas = json_content[id].content_items;

    if ( content_areas != undefined) {
        for (var i = 0; i < content_areas.length; i++) {
            var currentItem = content_areas[i];
            switch (currentItem.type) {
                case "detail":
                    emptyDetail = createOnlyOnce(emptyDetail, create_detail, currentItem );
                    break;
                case "task":
                    emptyTask = createOnlyOnce(emptyTask, create_task, currentItem );
                    break;
                default:
            }
        }
    }
}

/**
 * Erstellt View-Section
 * @param content_item
 */
function create_detail(content_item) {

    // finde root-Elemente für objekt-Template
    var root_element = document.getElementById(content_item.render_container);
    var content_item_list = content_item.content;

    // erzeuge eine echte Kopie des Template Elements
    var current_detail_element = detail_template.cloneNode(true);
    $('#detailview').attr('data-tags',json_content[id].tags);

    //noinspection JSUndeclaredVariable
    current_link_name = $(div_by_data+"='" + id + "']").attr('data-tags');

    var trim_curr_link = current_link_name.replace(/\s+/g, '');
    $(filter + "[id='" + trim_curr_link + "']").addClass('active').siblings().removeClass('active');

    var lb_thumb_liste = current_detail_element.querySelector("#lb_thumbnails");
    var thumb_width = parseInt( ( detail_width - (content_item_list.length - 1) * space ) / content_item_list.length);

    create_preview(content_item_list, current_detail_element);
    create_lb_thumbs(content_item_list, lb_thumb_liste, thumb_width);

    $(current_detail_element).appendTo( root_element );
}

/**
 * Erstellt Preview (Picture)
 * @param content_item_list
 * @param current_detail_element
 */
function create_preview(content_item_list, current_detail_element) {
    var detail      = content_item_list[0].detail;
    var figure      = $(current_detail_element).find("#preview");
    //var mediatype   = detail[0].mediatype;
    var picture     = detail[0].stand;
    var source      = detail[0].src;
    var title      = detail[0].title;

    if( picture == undefined) picture = source;

    var imgp  = $('<img>');
    $(imgp).appendTo( figure );
    $(imgp).attr('src',picture);
    $(figure).attr('data-source',source);
    $(figure).attr('data-title',title);

    image_resize_position(imgp,470,331);
}

/**
 * Aendert Preview, wenn auf Thumbnail geklickt
 * @param obj
 */
function update_preview(obj) {
    var picture = $(obj).attr('data-preview').split('.');
    picture = ( picture[0] + ".jpg" ).split('/');
    picture = "assets/content/img/" + $(picture).get(-1);

    var $figure = $('figure');

    $figure.children('img').remove();

    var imgp = $('<img>');
    $(imgp).appendTo('figure');
    $(imgp).attr('src', picture);

    $figure.attr('data-source', $(obj).attr('data-source'));
    $figure.attr('data-title', $(obj).attr('data-title'));

    image_resize_position('figure img', 470, 331);
}

/**
 * Erzeugt Thumbnail fuer Preview
 * @param content_item_list
 * @param lb_thumb_liste
 * @param thumb_width
 */
function create_lb_thumbs(content_item_list,lb_thumb_liste,thumb_width) {

    detail_array = [];
    detail_length = content_item_list.length;

    for (var i = 0; i < content_item_list.length; i++) {
        var thumb       = content_item_list[i].thumb;
        var src         = content_item_list[i].detail[0].src;
        var title       = content_item_list[i].detail[0].desc;
        var mediatype   = content_item_list[i].detail[0].mediatype;
        var picture     = content_item_list[i].detail[0].stand;
        if ( picture == undefined) picture = src;

        detail_array.push(content_item_list[i].detail);

        var li  = $('<li>');
        var a  = $('<a>');
        var img  = $('<img>');

        $(li).appendTo( lb_thumb_liste );
        $(li).css('width',thumb_width) ;

        $(a).appendTo( li );
        $(a).css('width',thumb_width) ;
        $(a).attr('href','#');
        $(a).attr('data-preview',picture);
        $(a).attr('data-source',src);
        $(a).attr('data-title',title);
        $(a).attr('data-filter',mediatype);

        $(img).appendTo( a );
        $(img).attr('src',thumb);
        $(img).css('width',thumb_width) ;
    }

}

/**
 * Erstellt Textauszug-/Aufgaben-Section
 * @param content_item
 */
function create_task(content_item) {

    // lies das root aus
    var rootElement = document.getElementById(content_item.render_container);

    // erzeuge eine echte Kopie des Template Elements
    var current_task_element = task_template.cloneNode(true);
    var content_item_list    = content_item.content;

    task_length = content_item_list.length;

    $(current_task_element).attr("data-other",id);
    $(current_task_element).load(content_item_list[0].src, function() {
        //alert( "Load was performed." );
        var h2 = '<h2>'+task_title +'</h2>';
        $(h2).insertBefore('p:first').prependTo( $(this) );
        var new_height = $('#task').height();
        $('#container').css('height',new_height+50);
    });

    rootElement.appendChild(current_task_element);
}

/**
 * Aktualisiert den Aufgabenbereich
 */
function update_task() {
    var data = json_content[id].content_items[1].content[darr_id_1];
    var task_content = data.src;
    $('#task').load(task_content, function () {
        var h2 = '<h2>' + task_title + '</h2>';
        $(h2).insertBefore('p:first').prependTo($(this));
    });
}

/**
 * Aktualisiert in Lightbox-Ansicht die Inhalt bei Navigation ueber vor/zurueck
 */
function update_lightbox_content() {
    var detail_content = detail_array[darr_id_1][darr_id_2];
    var source = detail_content.src;
    var title = detail_content.desc;
    var stand = detail_content.stand;

    var $precontent = $('.precontent');

    var mtype = $precontent.attr('id');

    if (mtype == 'video') {
        $precontent.attr({
            "src": source,
            'poster': stand
        });
    } else if (mtype == 'image') {
        $precontent.attr({
            "src": source
        });
        $precontent.load(function () {
            $(this).overlay('update');
        })
    } else if (mtype == 'text') {
        $precontent.text(source);
        $precontent.load(source, function () {
            $(this).overlay('update');
        });
    }
    $('#desc').text(title);
}

/**
 * Template auslesen und entfernen
 * @param templateName
 * @param elementTemp
 * @returns {Node|*}
 */
function read_remove_template(templateName, elementTemp) {

    // lies das Template aus und entferne es aus dem root-Element
    var template;
    if (elementTemp) {
        if (templateName) template = elementTemp.querySelector(templateName);
        else template = document.getElementById(elementTemp)
    } else template = document.getElementsByClassName(templateName)[0];
    template.parentNode.removeChild(template);

    return template;
}

/**
 * Überprüft ob Section leer und erstellt diese, wenn leer
 * @param emptySect
 * @param createFunction
 * @param currentItem
 * @returns {boolean}
 */
function createOnlyOnce(emptySect, createFunction, currentItem) {
    if (emptySect == true) createFunction(currentItem);
    emptySect = false;
    return emptySect;
}

