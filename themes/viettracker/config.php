<?php
/*
 * http://ndesaintheme.com/themes/apricot
 * site template : http://www.templatemonster.com/demo/58895.html
 *
 */
$domain = "//ci.quannh.dev/themes/";

$config['assets_url'] = "$domain";
$config['assets_dir'] = "D:\PHP-www\Quannh\CodeIgniter-3.0.6\themes";

$config['css'] = array(
    'gps.2.0.css',
    $domain.'viettracker/plugin/dropdown-check-list/ui.dropdownchecklist.themeroller.css',
    $domain.'viettracker/plugin/timepicker-addon/jquery-ui-timepicker-addon.css',

);
$gmap_api_key = 'AIzaSyDv63aI2TwqzUiPAY_dXtMUttX-Ov6vWes';
$config['js'] = array(
   'http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',
	'http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js',

	//'http://maps.google.com/maps/api/js?sensor=true&language=vi',
	"https://maps.googleapis.com/maps/api/js?key=$gmap_api_key", //&callback=vmap.ini
	$domain.'viettracker/plugin/dropdown-check-list/ui.dropdownchecklist.js',
    $domain.'viettracker/plugin/timepicker-addon/jquery-ui-timepicker-addon.js',
    '../datatables/js/jquery.dataTables.min.js',
    '../highcharts/highcharts.js',
	//'gps.js',
	'i18n.js',
	'mapgps.js',
	'gps.js',
// 	'playback.js',
	'report.js',
	'tracking.js',

);