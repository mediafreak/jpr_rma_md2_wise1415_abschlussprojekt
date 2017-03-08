/**
 * Created by mediafreak on 24.01.15.
 */

(function(){
    var $ = jQuery;

    //fn alias to the property, $ = constructor function
    $.fn.imageSize = function(method, options) {

        if( !method ) method = "init";

        var is = $.extend({ maxWidth: 500,
                            maxHeight: 500,
                            fade: true,
                            fadeTime: 200}, options);

        switch(method){
            case "init":
                if(is.fade) $(this).hide();
                this.load(function(){
                    img_resize(this, is);
                    if(is.fade){
                        $(this).fadeIn(is.fadeTime);
                    }
                });
                break;
            case "update":
                this.each(function(){
                    img_resize(this, is);
                });
                break;
            case "position":
                this.each(function () {
                    retouch_image_position(this);
                });
        }
    };


    /**
     * Passt Bild in Bildbereich ein
     * Funktion sollte noch optimiert werden
     * @param image
     * @param is
     */
    function img_resize(image, is) {
        var height = $(image).height();
        var width  = $(image).width();
        var ratioref = is.maxWidth / is.maxHeight;
        var ratio = width/height;

        if( width > height && width > is.maxWidth){
            if( ratio < ratioref) {
                $(image).css("width", is.maxWidth + "px");
                $(image).css("height", (height / width * is.maxWidth) + "px");
            } else {
                $(image).css("height", is.maxHeight + "px");
                $(image).css("width", is.maxHeight * ratio + "px");
            }
            retouch_image_position(image);
        }else if( width < height && height > is.maxHeight ) {
            if( ratio < ratioref) {
                $(image).css("width", is.maxWidth + "px");
                $(image).css("height", is.maxWidth * height / width + "px");
            } else {
                $(image).css("width", is.maxWidth + "px");
                $(image).css("height", is.maxWidth * height / width + "px");
            }
            retouch_image_position(image);
        }
    }

    /**
     * Zentriert das Bild nach resize
     * @param image
     */
    function retouch_image_position(image) {
        var height = $(image).height();
        var width  = $(image).width();
        var ratio = width/height;

        var diff;
        if( ratio > 1 ){
            diff = ( width - $("#detail").width() ) / 2;
            $(image).css("left", -diff+"px");
        }else {
            diff = ( height - $("#detail").height() ) / 2;
            $(image).css("top", -diff+"px");
        }
    }
}).call();