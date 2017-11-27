<?php
function add_js($file=NULL){
    $ci = get_instance();

    $items = $ci->config->item('js');
    $items[] = $file;
    $ci->config->set_item('js', $items);
}

function add_css($file=NULL){
    if( is_string($file) && strlen($file) < 4 )
        return ;
    $ci = get_instance();
    if( isset($ci->smarty) ){
        $ci->smarty->add_css($file);
    }
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
            list ($layout_path, $file_taget) = Modules::find("assets/js/$file",$module_name);
            break;
        case 'css':
            list ($layout_path, $file_taget) = Modules::find("assets/css/$file",$module_name);
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



function add_root_asset($file=NULL){
    $path_info = pathinfo($file);
    switch ($path_info['extension']){
        case "js":
            add_js("{root_assets}$file");
            break;
        case 'css':
            add_css("{root_assets}$file");
            break;
    }
    
}
