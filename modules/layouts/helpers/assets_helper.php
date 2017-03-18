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

function add_asset($file=NULL,$folder=''){
    $ci = get_instance();
    if( !isset($ci->smarty) ){
        return ;
    }
    if( is_string($file) ){

        $dir = NULL;
        if( strlen($folder) > 0 ){
            $dir = config_item('assets_url').DS."$folder/";
        }
        $type = get_mime_by_extension($file);


        switch ($type){
            case 'text/css':
                $dir .="css/";
                break;
            case 'application/x-javascript':
                $old_config = config_item('js');
                $old_config[] = "$dir/js/$file";
                $ci->config->set_item('js', $old_config);
                break;
        }

    }
}
