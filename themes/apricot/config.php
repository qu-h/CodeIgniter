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
    'signin.css',

);

$config['js'] = array(
    //"jquery-3.1.1.min.js",
    'jquery.min.js',
    "bootstrap.min.js",
    'preloader.js',
    'app.js',
    'load.js',


    'main.js',
    'skin-select/jquery.cookie.js',
    'skin-select/skin-select.js',
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
    'chart/jquery.sparkline.js',
    'clock/jquery.clock.js',
    'gage/raphael.2.1.0.min.js',
    'gage/justgage.js',


    'map/gmap3.js',
    "https://maps.googleapis.com/maps/api/js?key=$gmap_api_key"

);