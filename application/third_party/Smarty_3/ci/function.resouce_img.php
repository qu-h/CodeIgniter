<?php
function smarty_function_resouce_img($params,$content,$template=null, &$repeat=null){
    $file = ( isset($params['file']) )?$params['file']:null;
    $class = ( isset($params['class']) )?$params['class']:null;
    $style = ( isset($params['style']) )?$params['style']:null;
    $return = ( isset($params['return']) )?$params['return']:'img';

    $resource_url = $content->CI->config->config['resouce_url'];
    $resource_dir = $content->CI->config->config['resouce_dir'];
    if( file_exists($resource_dir.DS.$file) ){

        switch ($return){
            case 'src':
                $html = $resource_url.'/'.$file; break;
            case 'img':
            default :
                $html = '<img alt="" '.( ($class)?'class="'.$class.'"' : null ).' src="'.$resource_url.'/'.$file.'" '.( ($style)?'style="'.$style.'"' : null ).'>';
                break;
        }
        return $html;
    }

}