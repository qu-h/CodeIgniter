<?php
if ( !function_exists('temp_view')) {
    function temp_view($view, $vars = array(), $return = FALSE){
        get_instance()->template->build($view,$vars);
    }
}