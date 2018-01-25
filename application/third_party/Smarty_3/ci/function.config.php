<?php
function smarty_function_config($params,$content,$template=null, &$repeat=null){
    $item = ( isset($params['item']) )?$params['item']:null;

    $CI =& get_instance();
    $html = $CI->config->item($item);
    return $html;


}