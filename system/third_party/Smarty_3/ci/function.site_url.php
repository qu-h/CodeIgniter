<?php
function smarty_function_site_url($params,$content,$template=null, &$repeat=null){
    if( isset($params['uri']) ){
        return site_url($params['uri']);
    } else {
        return base_url();
    }

}