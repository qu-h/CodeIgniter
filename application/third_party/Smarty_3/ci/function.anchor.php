<?php
function smarty_function_anchor($params){
    if( !isset($params['txt']) ){
        $params['txt'] = "&nbsp";
    }
    if ( ! function_exists('anchor')) {
        $CI =& get_instance();
        $CI->load->helper('url');
    }
    $uri = ( isset($params['uri']) )?$params['uri']:null;
    $attributes = [];
    if( isset($params['class']) ){
        $attributes['class'] = $params['class'];
    }
    return anchor( $uri,lang($params['txt']),$attributes );



}
