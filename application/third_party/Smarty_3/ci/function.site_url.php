<?php
function smarty_function_site_url($params,$content,$template=null, &$repeat=null){
    $uri = isset($params['uri']) ? $params['uri'] : NULL;
    $isNull = isset($params['isNull']) ? $params['isNull'] : FALSE;
    if( strlen($uri) < 1 && $isNull ){
        $uri = NULL;
    }
    return site_url($uri);

}