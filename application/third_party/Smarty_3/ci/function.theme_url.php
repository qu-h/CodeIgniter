<?php
function smarty_function_theme_url($params){
    $file = isset($params['file']) ? $params['file'] : NULL;

    $ci = get_instance();
    return $ci->config->item('theme_url')."".$file;

}