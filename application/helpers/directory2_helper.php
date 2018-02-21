<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function mkdir_full($path,$mode = 0655) {
    $path = str_replace("\\", "/", $path);
    $path = explode("/", $path);
    $rebuild = '';
    foreach($path AS $p) {
        if(strstr($p, ":") != false) {
            $rebuild = $p;
            continue;
        }
        $rebuild .= "/$p";
        if(!is_dir($rebuild))
            mkdir($rebuild,$mode);
    }
}