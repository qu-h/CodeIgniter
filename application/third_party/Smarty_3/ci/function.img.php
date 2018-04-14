<?php
function smarty_function_img($params,$content,$template=null, &$repeat=null){
    $file = ( isset($params['file']) )?$params['file']:null;
    $class = ( isset($params['class']) )?$params['class']:null;
    $style = ( isset($params['style']) )?$params['style']:null;
    $return = ( isset($params['return']) )?$params['return']:'img';

    $CI =& get_instance();

    $url = $CI->config->item("base_url").($file);
    $url = str_replace('index.php/', null, $url);
    switch ($return){
        case 'src':
            $html = $url; break;
        case 'img':
        default :
            $html = '<img alt="" '.( ($class)?'class="'.$class.'"' : null ).' src="'.$url.'" '.( ($style)?'style="'.$style.'"' : null ).'>';
            break;
    }
    return $html;


}