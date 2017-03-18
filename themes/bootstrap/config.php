<?php

$domain = "//ci.quannh.dev/themes/bootstrap/";

$config['assets_url'] = "$domain";
$config['assets_dir'] = "E:/PHP-www/Quannh/CodeIgniter-3.0.6/themes/bootstrap/";

$config['css'] = array(
    assets('bootstrap.css','bootstrap'),

);

$config['js'] = array(
    assets("jquery-3.1.1.min.js",'jquery'),
    assets('tether.min.js','tether'),
    assets('bootstrap.min.js','bootstrap'),

);