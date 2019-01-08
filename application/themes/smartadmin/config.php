<?php

$domain = "http://ci-3-0-1.loc/smartadmin";
$config['theme_dir'] = BASE_APP_PATH."themes/smartadmin/";
$config['theme_url'] = env('ASSETS_GIT_PATH')."/themes/SmartAdmin/";
$config['css'] = array(
//    "bootstrap.min.css",
//    "font-awesome.min.css",
    //SmartAdmin Styles : Caution! DO NOT change the order
//    "smartadmin-production.css",

    //SmartAdmin RTL Support
//    "$domain/css/smartadmin-rtl.min.css",
    //Demo purpose only: goes with demo.js, you can delete this css when designing your own WebApp
//    "$domain/css/demo.min.css",
//    "$domain/css/ict.css",
//     "//fonts.googleapis.com/css?family=Open+Sans:400italic,700italic,300,400,700"

    git_assets("styles.min.css",'themes/SmartAdmin')
);

$config['js'] = [ git_assets("smart-admin-ict.js",'themes/SmartAdmin')];
