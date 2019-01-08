<?php
function smarty_function_site_url($params){
    $uri = isset($params['uri']) ? $params['uri'] : NULL;
    $isNull = isset($params['isNull']) ? $params['isNull'] : FALSE;
    $uri_change_to = isset($params['change']) ? $params['change'] : NULL;
    $id = isset($params['id']) ? $params['id'] : 0;
    $uriBack = isset($params['uriBack']) ? $params['uriBack'] : NULL;
    $query = isset($params['q']) ? $params['q'] : [];

    if( strlen($uri) < 1 && $isNull ){
        $uri = NULL;
    }

    if( $uri_change_to =='edit' ){
        $uri = url_to_edit($uri,$id);
    }

    if( strlen($uriBack) > 0 ){
        $query['back'] = base64url_encode($uriBack);
        return site_url($uri)."?back=".base64url_encode($uriBack);
    } else {
        $q = "";
        if( !empty($query) ){
            $q = "?"._stringify_attributes($query,true);
        }

        return site_url($uri).$q;
    }


}