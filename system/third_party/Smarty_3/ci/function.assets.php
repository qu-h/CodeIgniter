<?php
function smarty_function_assets($params,$content,$template=null, &$repeat=null){
    $type = ( isset($params['type']) )?$params['type']:null;
    $resource_dir = $content->get_template_vars('assets_dir');
    $resource_url = $content->get_template_vars('assets_url');
    $theme_url = get_instance()->config->item('theme_url');

    $root_assets_url = get_instance()->config->item('root_assets_url');

    if( $type ){
        $folder = $content->theme;
        $html = '';
        if($type=='css'){

            foreach ($content->css AS $file){
                if( substr($file,0,2) != '//' && substr($file,0,4) != 'http' ){

                    if( file_exists($resource_dir.'/css/'.$file) ){
                        $file = $resource_url.'/css/'.$file;
                    } else if (file_exists($resource_dir.'/'.$file)) {
                        $file = $resource_url.$file;
                    } elseif ( strpos($file, '{root_assets}') !== false ){
                        $file = str_replace('{root_assets}', $root_assets_url, $file);
                    } else {
                        $file = "$resource_url/$folder/css/$file";
                    }

                }
                $html .= '<link rel="stylesheet"   href="'.$file.'" type="text/css" media="all" />
                    '; //id='woocommerce-layout-css'
            }
       } else if ( $type=='js' AND !empty($js = get_instance()->config->item('js') ) ){

            foreach ($js AS $file){
                if( substr($file,0,2) == '//' || substr($file,0,4) == 'http' ){

                } elseif( file_exists($resource_dir.'/js/'.$file) ){
                    $file = $theme_url.'/js/'.$file;
                } else if (file_exists($resource_dir.$file)) {
//                     $file = $resource_url.$file;
                } elseif (file_exists($resource_dir."/$folder/js/".$file) ) {
                    $file = "$theme_url/$folder/js/$file";
                } elseif ( strpos($file, '{root_assets}') !== false ){
                    $file = str_replace('{root_assets}', $root_assets_url, $file);
                } else {
                    $file = "$theme_url/$folder/js/$file";
                }

                $html .= '<script type="text/javascript" src="'.$file.'" ></script>';
            }
        } elseif ($type=='css_lte_ie9' AND !empty($css = get_instance()->config->item('css_lte_ie9') )){
            foreach ($css AS $file){
                if( substr($file,0,2) != '//' && substr($file,0,4) != 'http' ){

                    if( file_exists($resource_dir.'/css/'.$file) ){
                        $file = $resource_url.'/css/'.$file;
                    } else if (file_exists($resource_dir.'/'.$file)) {
                        $file = $resource_url.$file;
                    } else {
                        $file = "$resource_url/$folder/css/$file";
                    }

                }
                $html .= '<link rel="stylesheet" type="text/css" media="screen" href="'.$file.'" type="text/css"/>';
            }
            $html = "<!--[if lte IE 9]>$html<![endif]-->";
        } else if ( $type=='js_lt_ie9' AND !empty($js = get_instance()->config->item('js_lt_ie9') ) ){

            foreach ($js AS $file){
                if( substr($file,0,2) == '//' || substr($file,0,4) == 'http' ){

                } elseif( file_exists($resource_dir.'/js/'.$file) ){
                    $file = $resource_url.'/js/'.$file;
                } else if (file_exists($resource_dir.$file)) {
                    //                     $file = $resource_url.$file;
                } elseif (file_exists($resource_dir."/$folder/js/".$file) ) {
                    $file = "$resource_url/$folder/js/$file";
                } else {
                    $file = "$resource_url/$folder/js/$file";
                }

                $html .= '<script src="'.$file.'" ></script>';
            }
            $html = "<!--[if lt IE 9]>$html<![endif]-->";
        }
        return $html;
    }

}
