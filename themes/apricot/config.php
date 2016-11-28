<?php
/*
 * http://ndesaintheme.com/themes/apricot
 * site template : http://www.templatemonster.com/demo/58895.html
 *
 */
$domain = "//ci.quannh.dev/themes/";
$gmap_api_key = 'AIzaSyDv63aI2TwqzUiPAY_dXtMUttX-Ov6vWes';
$config['assets_url'] = "$domain";
$config['assets_dir'] = "D:\PHP-www\Quannh\CodeIgniter-3.0.6\themes";

$config['css'] = array(
    'loader-style.css',
    "bootstrap.min.css",
//     'signin.css',

    '../js/progress-bar/number-pb.css'
);

$config['css_loggedin'] = array(
    'style.css',
);

$gmap_api_key = 'AIzaSyDv63aI2TwqzUiPAY_dXtMUttX-Ov6vWes';

$config['js'] = array(
    //"jquery-3.1.1.min.js",
    'jquery.min.js',
    "bootstrap.min.js",
    'preloader.js',



//     'skin-select/jquery.cookie.js',
    //'skin-select/skin-select.js',


    'clock/date.js',
    'newsticker/jquery.newsTicker.js',
    'custom/scriptbreaker-multiple-accordion-1.js',
    'slidebars/slidebars.min.js',
    'http://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js',
    'search/jquery.quicksearch.js',
    'gage/jquery.easypiechart.min.js',
    'tip/jquery.tooltipster.js',
    'nano/jquery.nanoscroller.js',
    'pace/pace.js',

    /*
     * Main
     */
//     'progress-bar/src/jquery.velocity.min.js',
//     'progress-bar/number-pb.js',
//     'progress-bar/progress-app.js',

    "https://maps.googleapis.com/maps/api/js?key=$gmap_api_key",
    'gmap3/gmap3.js',
//
//     'jhere-custom.js',

);

$config['js_loggedin'] = array(

    'chart/jquery.sparkline.js',
    'chart/jquery.flot.js',
    //     'chart/jquery.flot.resize.js',
    'chart/realTime.js',




    'speed/canvasgauge-coustom.js',
    'countdown/jquery.countdown.js',

    'clock/jquery.clock.js',
    'gage/raphael.2.1.0.min.js',
    'gage/justgage.js',


    'app.js',
    'load.js',
    'main.js',

    'map/ictmap.js'
);