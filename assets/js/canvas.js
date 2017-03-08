/**
 * ==================================================
 * Javascript:    canvas.js
 *
 * @author        Jenny Pilz
 * @date            2015/01
 *
 * @version        1.0
 * ================================================== */

/**
 * Canvas für Bild und Video
 * @constructor
 */
function Canvas() {

    var canvas_orig,
        canvas_eff,
        context_stack,
        context_target,
        current_canvas;

    var imageData,
        data,
        imageData_orig;

    var filter_fn,
        video;


    this.init_canvas = function() {

        canvas_orig = document.getElementById("canvas_orig");
        canvas_eff = document.getElementById("canvas_eff");
    };

    /**
     * Kopiert Video aus DOM in die Canvas
     * Eventlistener checkt ob Video laeuft und ruft dann requestanimationframe aus
     */
    this.copy_video = function() {
        if (canvas_orig.getContext) {
            context_stack = canvas_orig.getContext('2d');
            context_target = canvas_eff.getContext('2d');
            video = document.getElementById("video");

            video.addEventListener('play', function () {
                req_animate_frame(draw_video);
            });
        }
    };

    /**
     * speichert Daten in erster Canvas und speichert dieser
     * holt daten aus erster Canvas und speichert diese in zweite Canvas mit manipulierten Pixeln
     * bisher Loesung so, dass wenn Filterbutton gedrueckt werden, diese als Variable gespeichert
     * und dann die jeweilige Funktion bei kopieren in die zweite Canvas aufgerufen wird
     * Originaldaten werden fuer Reset gespeichert
     */
    var draw_video = function () {
        var width = parseInt($(video).css('width'));
        var height = parseInt($(video).css('height'));
        context_stack.drawImage(video, 0, 0, width, height);
        imageData = context_stack.getImageData(0, 0, canvas_orig.width, canvas_orig.height);
        imageData_orig = context_stack.getImageData(0, 0, canvas_orig.width, canvas_orig.height);
        data = imageData.data;
        current_canvas = context_target;
        if (filter_fn) {
            switch (filter_fn) {
                case "brightness":
                    canvas.brightness();
                    break;
                case "contrast":
                    canvas.contrast();
                    break;
                case "grayscale":
                    canvas.grayscale();
                    break;
                case "invert":
                    canvas.invert();
                    break;
                case "noise":
                    canvas.noise();
                    break;
                case "saturate":
                    canvas.saturate();
                    break;
                case "sepia":
                    canvas.sepia();
                    break;
                case "reset":
                    canvas.reset();
                    break;
            }
        }

        if (!video.paused) {
            req_animate_frame(draw_video);
        }
    };

    /**
     * Request AnimationFrame fuer alle Webbrowser
     * Quelle: Galileo Press HTML5 + CSS3
     */
    var req_animate_frame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 1000 / 60);
            };
    })();

    /**
     * Setzt für das Redrawing die Canvas zurück
     */
    this.clear_rect = function () {
        // Aktuelle Canvas sichern
        context_stack.save();

        // Matrix identifizieren von Canvas die geloescht werden soll
        context_stack.setTransform(1, 0, 0, 1, 0, 0);
        context_stack.clearRect(0, 0, canvas_orig.width, canvas_orig.height);

        context_stack.restore();

        this.copy_image();
    };

    /**
     * Kopiert Bild aus DOM in die Canvas
     * holt daten aus Canvas und speichert diese für spätere Pixelmanipulation
     * Originaldaten werden fuer Reset gespeichert
     */
    this.copy_image = function() {

        if (canvas_orig.getContext) {
            context_stack = canvas_orig.getContext('2d');
            var image = document.getElementById("image");
            var source = $(image).attr('src');
            console.log(source);
            var img = new Image();
            img.src = source;
            var width = parseInt($(image).css('width'));
            var height = parseInt($(image).css('height'));
            console.log(width, height);
            img.onload = function () {

                context_stack.setTransform(1, 0, 0, 1, width * .5, height * .5);
                context_stack.drawImage(img, -width * .5, -height * .5, width, height);

                imageData = context_stack.getImageData(0, 0, canvas_orig.width, canvas_orig.height);
                imageData_orig = context_stack.getImageData(0, 0, canvas_orig.width, canvas_orig.height);
                data = imageData.data;
            };
            current_canvas = context_stack;
        }
    };

    /**
     * Filteraufruf
     * Bilddaten werden an Funktion uebergeben
     */
    this.brightness = function() {
        effects.brightness(data, 20);
        current_canvas.putImageData(imageData, 0, 0);
    };

    this.contrast = function() {
        effects.contrast(data, 20);
        current_canvas.putImageData(imageData, 0, 0);
    };

    this.grayscale = function() {
        effects.grayscale(data, 55);
        current_canvas.putImageData(imageData, 0, 0);
    };

    this.invert = function () {
        effects.invert(data);
        current_canvas.putImageData(imageData, 0, 0);
    };

    this.noise = function () {
        effects.noise(data, 55);
        current_canvas.putImageData(imageData, 0, 0);
    };

    this.saturate = function () {
        effects.saturate(data, 2);
        current_canvas.putImageData(imageData, 0, 0);
    };

    this.sepia = function() {
        effects.sepia(data);
        current_canvas.putImageData(imageData, 0, 0);
    };

    /*this.blur = function() {
     effects.blur();
     }*/

    this.reset = function () {
        effects.reset(imageData_orig.data);
        imageData = imageData_orig;
        current_canvas.putImageData(imageData, 0, 0);
        imageData_orig = current_canvas.getImageData(0, 0, canvas_orig.width, canvas_orig.height);
        data = imageData.data;
    };

    this.set_filter = function (fn) {
        console.log(fn);
        filter_fn = fn;
    }
}

var canvas = new Canvas();
