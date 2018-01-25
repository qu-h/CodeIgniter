<?php
function smarty_function_theme_img($params,$content,$template=null, &$repeat=null){
    $file = ( isset($params['file']) )?$params['file']:null;

    $theme_url = get_instance()->config->item('theme_url');
    return $theme_url."/images/$file";
}