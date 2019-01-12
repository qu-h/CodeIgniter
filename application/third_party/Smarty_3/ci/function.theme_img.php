<?php
function smarty_function_theme_img($params,$content,$template=null, &$repeat=null){
    $file = ( isset($params['file']) )?$params['file']:null;
    $return = ( isset($params['return']) )?$params['return']:'src';


    if (filter_var($file, FILTER_VALIDATE_URL)) {
        $url = $file;
    } else {
        $theme_url = get_instance()->config->item('theme_url');
        $url = $theme_url."/images/$file";
    }

    switch ($return){
        case 'src':
            $html = $url; break;
        case 'img':
        default :
            $html = '<img alt="" src="'.$url.'" themurl=1/>';
            break;
    }
    return $html;

}