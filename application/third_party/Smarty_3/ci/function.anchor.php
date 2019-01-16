<?php
function smarty_function_anchor($params){
    if( isset($params['txt']) ){
        if ( ! function_exists('anchor')) {
            $CI =& get_instance();
            $CI->load->helper('url');
        }
        $uri = ( isset($params['uri']) )?$params['uri']:null;
        $attributes = [];
        if( isset($params['class']) ){
            $attributes['class'] = $params['class'];
        }
        $title = $uri;
        if( array_key_exists('txt',$params) ){
            $title = lang($params['txt']);
        }
        return anchor( $uri,$title,$attributes );
    }


}
