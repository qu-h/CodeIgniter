<?php
function smarty_function_resouce_img_from_json($params,$content,$template=null, &$repeat=null){
    $file = ( isset($params['file']) )?$params['file']:null;
    $class = ( isset($params['class']) )?$params['class']:null;
    $style = ( isset($params['style']) )?$params['style']:null;
    $null = ( isset($params['null']) )?$params['null']:'preview.png';
    $return = ( isset($params['return']) )?$params['return']:'img';

    $resource_url = $content->CI->config->config['resouce_url'];
    $resource_dir = $content->CI->config->config['resouce_dir'];

    $src = $resource_url."/$null";

    $files = json_decode($file);


    $img = ( $files && is_array($files) ) ? reset($files) : NULL ;

    if( $img && file_exists($resource_dir.DS.$img) ){
        $src = $resource_url.'/'.$img;
    }

    switch ($return){
        case 'src':
            $html = $src; break;
        case 'img':
        default :
            $html = '<img alt="" '.( ($class)?'class="'.$class.'"' : null ).' src="'.$src.'" '.( ($style)?'style="'.$style.'"' : null ).'>';
            break;
    }
    return $html;

}