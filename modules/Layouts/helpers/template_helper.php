<?php
if ( !function_exists('temp_view')) {
    function temp_view($view, $vars = array(), $return = FALSE){
        get_instance()->template->build($view,$vars);
    }
}

function set_temp_val($name="",$val=NULL){
    if( strlen($name) > 0 ){
    	get_instance()->smarty->assign($name,$val);
    }
}	