<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function input_get($index = NULL, $default=null, $xss_clean = NULL){
    $value= get_instance()->input->get($index, $xss_clean);
    if( $value == null ){
        $value = $default;
    }
    return $value;
}
function input_post($index = NULL, $xss_clean = NULL){
    $value = get_instance()->input->post($index, $xss_clean);
    return is_string($value) ? trim($value) : $value;
}
