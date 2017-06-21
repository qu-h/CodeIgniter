<?php
function smarty_function_lang($params){
    $txt = NULL;
    if( isset($params['txt']) ){
        $txt = $params['txt'];
    } elseif ( isset($params["text"])){
        $txt = $params["text"];
    }
    if( $txt ){
        return lang($txt);
    }
    
}
