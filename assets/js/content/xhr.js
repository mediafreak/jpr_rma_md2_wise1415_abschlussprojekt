/**
 * ==================================================
 * Javascript:	xhr.js
 *
 * @author 		Jenny Pilz
 * @date		2015/01
 *
 * @version		1.0
 * ================================================== */

/*
 * an dieser Stelle eigentlich das XMLHTTPRequest
 * hier aber nur lokale Lösung
 *
 * Laedt die Inhalte aus der json-Datei und stellt sie als Objekt bereit
 *
 */

var json_content;


//function xhr(method, requestpath, obj, onsuccess, onerror) {
function json_rendering( requestpath ) {
    //console.log("xhr ", requestpath );

    // create the request
    //var xmlhttp = new XMLHttpRequest();
    //var url = null;

    if (requestpath) {
        requestpath = "assets/data/" + requestpath;

        $.getJSON(requestpath)
            .done(function (result) {
                set_json_content(result);
                $.getScript( "assets/js/navigation.js", function( ) {
                    navigation();
                });
            })
            .fail(function (error) {
                console.error("Fehler ", error);
            });

        /*xmlhttp.onreadystatechange = function() {}
        //open connection
         //xmlhttp.open()
        //send request
        if(obj) xmlhttp.send();
        */
    }
}

function set_json_content( result ) {
    json_content = result;

    create_thumbnails( );
}