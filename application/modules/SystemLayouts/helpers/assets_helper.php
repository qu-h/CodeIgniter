<?php
function assets($vars=NULL,$folder=''){
    if( is_string($vars) ){

        $dir = NULL;
        $assets_dir = config_item("assets_dir");
        if( !function_exists('get_mime_by_extension') ){
            get_instance()->load->helper('file');
        }
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
                    //bug($dir.DS.$vars);die;
                    break;
            }
        }


        return $dir.$vars;
    }
}

function git_assets($file=NULL,$folder='',$version=null,$attributes=NULL,$dirFileType=true){
    if( is_string($file) ){
        if( !function_exists('get_mime_by_extension') ){
            get_instance()->load->helper('file');
        }

        $dir = NULL;
        $assets_dir = env('ASSETS_GIT_PATH',config_item("assets_git_url"));
        if( strlen($folder) > 0 ) {
            if (substr($folder, 0, 7) === "jquery.") {
                $folder = "/" . str_replace("jquery.", "jquery/", $folder);
            }
            $assets_dir .= "/$folder";
        }

        if( strlen($version) > 0 ){
            $assets_dir .= "/$version";
        }
        $type = get_mime_by_extension($file);

        $dir = "$assets_dir/";
        switch ($type){
            case 'text/css':
            case 'css':
                if( $dirFileType ){
                    $dir .= "css/";
                }

                break;
            case 'application/x-javascript':
                if( $dirFileType ){
                    $dir .= "js/";
                }
                break;
            default:
                break;
        }

        if( !empty($attributes) && is_array($attributes)){
            $attributes['href'] = $dir.$file;
            return $attributes;
        }

        return $dir.$file;
    }
}

function add_git_assets($file=NULL,$folder='',$version=null,$attributes=NULL,$dirFileType=true){
    $file = git_assets($file,$folder,$version,$attributes,$dirFileType);

    add_asset($file);
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

//                $old_config = config_item('js');
//                if( file_exists("$dir/js/$file") ){
//                    $old_config[] = "$dir/js/$file";
//                } else if ( file_exists("$dir/$file") ){
//                    $old_config[] = "$dir/$file";
//                } else {
//                    $old_config[] = "$dir/$file";
//                }
//
//                $ci->config->set_item('js', $old_config);
                add_js($file);
                break;
            default:
                $fileInfo = pathinfo($file);
                if( $fileInfo['extension'] == 'js' ){
                    add_js($file);
                } elseif ( $fileInfo['extension'] == 'css' ){
                    add_css($file);
                }

                break;

        }

    }
}

function theme_url($file=""){
    $ci = get_instance();
    if (filter_var($file, FILTER_VALIDATE_URL)) {
        return $file;
    }
    return $ci->config->item('theme_url')."".$file;
}