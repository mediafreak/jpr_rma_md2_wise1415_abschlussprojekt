/**
 * ==================================================
 * Javascript:  navigation.js
 *
 * @author		Jenny Pilz
 * @date		2015/01
 * @version		1.2
 * ================================================== */

/**
 * Erzeugt das Menue aus den data-tags der Listenpunkte
 */

var number_of_child_thumb = 0,
    number_of_child_lbthumb = 0;

/*----------------------------
    Set Navigation
 -----------------------------*/

function navigation() {

    number_of_child_thumb = $(liste).children().length;
    number_of_child_lbthumb = $('#lb_thumbnails').children().length;

    $(items).each(function () {

        var elem = $(this),
            tags = elem.data('tags').split(',');

        // Ueberfluessige Leerzeichen loeschen
        // Leeres Array um Listeneintrag zu speichern
        // Jeden Listeneintrag mit Tag zu Array hinzufuegen
        $.each(tags, function (key, value) {

            value = $.trim(value);

            if (!(value in items_by_tags))
                items_by_tags[value] = [];

            items_by_tags[value].push(elem);
        });
    });

    // Home-Seite in Liste eintragen (alles ist sichtbar)
    // Ueber Array laufen und Liste für Navigation ueber create_nav_items_list vervollstaendigen
    create_nav_items_list('Home', $(items));
    var trim_curr_link = current_link_name.replace(/\s+/g, '');
    $(filter + "[id='" + trim_curr_link + "']").addClass('active');

    $.each(items_by_tags, function (k, v) {
        create_nav_items_list(k, v);
    });

}

// Hilfsfunktion fuer Navigation und Li-Items
function create_nav_items_list(text) {
    //console.log(  text.replace(/\s+/g, ''));

    // Menueintraege ueber ul
    var a = $('<a>', {
        html: text,
        id: text.replace(/\s+/g, ''),
        href: '#'+text
    }).appendTo(nav_header);
}

