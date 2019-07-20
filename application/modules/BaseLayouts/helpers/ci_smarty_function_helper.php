<?php
function add_js($file=NULL, $is_public=false){
    if( strlen($file) < 4 )
        return ;
    if( $is_public ){
        $file = base_url($file);
    }
    $ci = get_instance();

    $files = $ci->config->item('js');
    if( is_null($files) ){
        $files = [];
    }
    if (!in_array($file,$files)){
        array_push($files,$file);
    } else {

    }
    $ci->config->set_item('js', $files);
}

function add_css($file=NULL, $is_public=false){
    if( strlen($file) < 4 )
        return ;

    if( $is_public ){
        $file = base_url($file);
    }
    $ci = get_instance();
    $files = $ci->config->item('css');
    if( is_null($files) ){
        $files = [];
    }
    if (!in_array($file,$files)){
        array_push($files,$file);
    }
    $ci->config->set_item('css', $files);
}

function add_js_ready($script=''){
    if( strlen($script) < 4 )
        return ;
    $ci = get_instance();
    if( isset($ci->smarty) ){
        $ci->smarty->js_ready($script);
    }
}

function add_js_header($script=''){
    if( strlen($script) < 4 )
        return ;
    $ci = get_instance();
    if( isset($ci->smarty) ){
        $ci->smarty->js_header($script);
    }
}

function add_module_asset($file=NULL,$module_name=NULL){
    $file_return = NULL;
    if( !$module_name ){
        $ci = get_instance();
        $module_name = $ci->router->module;
    }

    $path_info = pathinfo($file);
    switch ($path_info['extension']){
        case "js":
            list ($layout_path, $file_taget) = Modules::find($file,$module_name,'assets/js/',true);
            break;
        case 'css':
            list ($layout_path, $file_taget) = Modules::find($file,$module_name,"assets/css/",true);
            break;
    }

    if( $layout_path != NULL ){

        if (strpos($layout_path, APPPATH) !== false) {
            $dir = str_replace(APPPATH, NULL, $layout_path);
            $file_return = base_url($dir.$file_taget);
        }
    }

    if( $file_return ){
        switch ($path_info['extension']){
            case "js":
                add_js($file_return);break;
            case "css":
                add_css($file_return);break;
        }

    }
}