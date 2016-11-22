<?php
function smarty_function_anchor($params){
    if( isset($params['txt']) ){
        if ( ! function_exists('anchor')) {
            $CI =& get_instance();
            $CI->load->helper('url');
        }
        $uri = ( isset($params['uri']) )?$params['uri']:null;
        return anchor( $uri,lang($params['txt']) );
    }


}
