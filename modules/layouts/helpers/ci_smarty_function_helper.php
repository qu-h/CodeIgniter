<?php
function add_js($file=NULL){
    if( strlen($file) < 4 )
        return ;
    $ci = get_instance();
    if( isset($ci->smarty) ){
        $ci->smarty->add_js($file);
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