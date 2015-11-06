<?php
function smarty_function_assets($params,$content,$template=null, &$repeat=null){
    $type = ( isset($params['type']) )?$params['type']:null;
    $resource_dir = $content->CI->config->config['assets_dir'];
    $resource_url = $content->CI->config->config['assets_url'];
    if( $type ){
       
        $html = '';
        if($type=='css'){
           
            
           

            foreach ($content->css AS $file){
                if( substr($file,0,2) != '//' ){
                    $file = $resource_url.'/ecoenergy/css/'.$file;
                }
                
                $html .= '<link rel="stylesheet"   href="'.$file.'" type="text/css" media="all" />'; //id='woocommerce-layout-css'
            }
        } else if ( $type=='js' ){
            foreach ($content->js AS $file){
                if( file_exists($resource_dir.'/js/'.$file) ){
                    $file = $resource_url.'/js/'.$file;
                } else if (file_exists($resource_dir.$file)) {
                    $file = $resource_url.$file;
                } else {
                    $file ='unknow.js';
                }
               
                $html .= '<script type="text/javascript" src="'.$file.'" ></script>'; //id='woocommerce-layout-css'
            }
        }
        return $html;
    }

}
