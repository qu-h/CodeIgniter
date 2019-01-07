<?php
function smarty_function_assets_git_url($params){
    $file = isset($params['file']) ? $params['file'] : NULL;
    $ci = get_instance();
    return $ci->config->item('assets_git_url')."".$file;

}