<?php
function add_js($file=NULL){
    $ci = get_instance();

    $items = $ci->config->item('js');
    $items[] = $file;
    $ci->config->set_item('js', $items);


//     if( is_array($file) ){
//         $file = assets($file[0],$file[1]);
//         $ci->smarty->add_js($file);
//     }
//     if( strlen($file) < 4 )
//         return ;

//     if( isset($ci->smarty) ){
//         $ci->smarty->add_js($file);
//     }
}

function add_css($file=NULL){
    if( strlen($file) < 4 )
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