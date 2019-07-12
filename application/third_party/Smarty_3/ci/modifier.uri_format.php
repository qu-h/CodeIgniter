<?php

function smarty_modifier_uri_format()
{
    $params = func_get_args();
    if( func_num_args() == 1 ){
        return $params[0];
    }
    $format = $params[0];
    unset($params[0]);
    $uri = vsprintf($format,$params);
    return site_url($uri);
}
