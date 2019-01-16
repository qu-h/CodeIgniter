<?php
function smarty_function_assets_git_url($params){
    $file = isset($params['file']) ? $params['file'] : NULL;
    $ci = get_instance();
    return env('ASSETS_GIT_PATH',$ci->config->item('assets_git_url'))."".$file;
}