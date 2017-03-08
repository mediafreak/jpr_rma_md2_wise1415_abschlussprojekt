/**
 * ==================================================
 * Javascript:    effects.js
 *
 * @author        Jenny Pilz
 * @date            2015/01
 *
 * @version        1.0
 * ================================================== */

/**
 * Filter für die Pixelmanipulation
 * Jeder Kanal hat ein eigenes Array und kann abgerufen und somit verändert werden
 *
 * for (var i = 0; i < data.length; i += 4) {
 * //Note: data[i], data[i+1], data[i+2], data[i+3] repraesentieren Rot, Gruen, Blau und Alpha
 * data[i] = data[i];
 * data[i+1] = data[i+1];
 * data[i+2] = data[i+2];
 * }
 */

function Filter() {

    this.brightness = function (data, factor) {
        for (var i = 0; i < data.length; i += 4) {
            data[i] += factor;
            data[i + 1] += factor;
            data[i + 2] += factor;
        }
    };

    this.contrast = function (data, factor) {
        var contrast = (259 * (factor + 255)) / (255 * (259 - factor));

        for (var i = 0; i < data.length; i += 4) {
            data[i] = contrast * (data[i] - 128) + 128;
            data[i + 1] = contrast * (data[i + 1] - 128) + 128;
            data[i + 2] = contrast * (data[i + 2] - 128) + 128;
        }
    };

    this.grayscale = function (data) {
        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // red
            data[i + 1] = avg; // green
            data[i + 2] = avg; // blue
        }
    };

    this.invert = function (data) {
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 225 - data[i]; // red
            data[i + 1] = 225 - data[i + 1]; // green
            data[i + 2] = 225 - data[i + 2]; // blue
        }
    };

    this.noise = function (data, factor) {
        var rand = (0.5 - Math.random()) * factor;
        for (var i = 0; i < data.length; i += 4) {
            data[i] = data[i] + rand;
            data[i + 1] = data[i + 1] + rand;
            data[i + 2] = data[i + 2] + rand;
        }
    };

    this.saturate = function (data, factor) {
        for (var i = 0; i < data.length; i += 4) {
            var avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg + factor * (data[i] - avg);
            data[i + 1] = avg + factor * (data[i + 1] - avg);
            data[i + 2] = avg + factor * (data[i + 2] - avg);
        }
    };

    this.sepia = function (data) {
        for (var i = 0; i < data.length; i += 4) {
            var r = data[i], g = data[i + 1], b = data[i + 2];
            data[i] = (r * 0.393) + (g * 0.769) + (b * 0.189);
            data[i + 1] = (r * 0.349) + (g * 0.686) + (b * 0.168);
            data[i + 2] = (r * 0.272) + (g * 0.534) + (b * 0.131);
        }
    };

    this.reset = function (data) {
        for (var i = 0; i < data.length; i += 4) {
            data[i] = data[i]; // red
            data[i + 1] = data[i + 1]; // green
            data[i + 2] = data[i + 2]; // blue
        }
    };


    /*this.convolve = function () {
     [0.0, -0.2, 0.0],
     [-0.2, 1.8, -0.2],
     [0.0, -0.2, 0.0]
     }

     this.blur = function (buff_data) {
     data = buff_data;
     }*/
}

var effects = new Filter();