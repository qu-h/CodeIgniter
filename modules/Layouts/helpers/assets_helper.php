<?php
function assets($vars=NULL,$themes=''){
    if( is_string($vars) ){

        $dir = NULL;
        if( strlen($themes) > 0 ){
            $dir = config_item('assets_url').DS."$themes/";
        }
        $type = get_mime_by_extension($vars);

        switch ($type){
            case 'text/css':
                $dir .="css/";break;
            case 'application/x-javascript':
                $dir .="js/";break;
        }
        return $dir.DS.$vars;
    }
}
