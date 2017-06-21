<?php
defined('BASEPATH') OR exit('No direct script access allowed');

function input_get($index = NULL, $xss_clean = NULL){
    return get_instance()->input->get($index, $xss_clean);
}
function input_post($index = NULL, $xss_clean = NULL){
    return get_instance()->input->post($index, $xss_clean);
}
