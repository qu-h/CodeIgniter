<?php

/**
 * @param $realPath
 * @param $linkName
 */
function create_image_symlink($realPath,$linkName){
    $folders = ['images'];

    if( is_string($linkName) ){
        $linkName = [$linkName];
    }
    foreach ($folders AS $folder){
        $path = realpath(FCPATH.DS.$folder);
        $source = realpath($realPath.DS."images");
        if( is_dir($path) != true || is_dir($source) != true ){
            continue;
        }
        foreach ($linkName AS $linkTo){
            $symlinkPath = $path.DS.$linkTo;
            if( is_dir($symlinkPath) != true ){
                exec('mklink "' . $symlinkPath . '" "' . $source . '" /J');
            }
        }
    }
}