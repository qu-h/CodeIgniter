<?php
function assets($vars=NULL,$folder=''){
    if( is_string($vars) ){

        $dir = NULL;
        $assets_dir = config_item("assets_dir");
        
        if( is_dir($assets_dir.DS.$folder) ){
            if( strlen($folder) > 0 ){
                $dir = config_item('assets_url').DS."$folder/";
            }
            $type = get_mime_by_extension($vars);
    
            switch ($type){
                case 'text/css':
                    $dir .="css/";
                    break;
                case 'application/x-javascript':
                    //$dir .="js/";
                    if( file_exists("$assets_dir/$folder/js/$vars") ){
                         return "$dir/js/$vars";
                    } else if ( file_exists("$assets_dir/$folder/$vars") ){
                        return "$dir/$vars";
                    }
                    bug($dir.DS.$vars);die;
                    break;
            }
        }
        

        return $dir.$vars;
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
                if( file_exists("$dir/js/$file") ){
                    $old_config[] = "$dir/js/$file";    
                } else if ( file_exists("$dir/$file") ){
                    $old_config[] = "$dir/$file";
                }
                
                $ci->config->set_item('js', $old_config);
                break;
        }

    }
}
