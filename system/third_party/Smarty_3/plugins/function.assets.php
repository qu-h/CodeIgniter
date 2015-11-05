<?php
function smarty_function_assets($params,$content,$template=null, &$repeat=null){
    $type = ( isset($params['type']) )?$params['type']:null;
    $resource = '//quannh.dev/';
    if( $type ){
       
        $html = '';
        if($type=='css'){
            
            foreach ($content->css AS $file){
                $html .= '<link rel="stylesheet"   href="'.$resource.'assets/ecoenergy/css/'.$file.'" type="text/css" media="all" />'; //id='woocommerce-layout-css'
            }
        }
        return $html;
    }
//     die('callme');
}
