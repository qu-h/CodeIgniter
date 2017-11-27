<?php
function smarty_function_img($params,$content,$template=null, &$repeat=null){
    $file = ( isset($params['file']) )?$params['file']:null;
    if( strlen($file) < 1 && isset($params['src']) ){
        $file = $params['src'];
    }

    $class = ( isset($params['class']) )?$params['class']:null;
    $style = ( isset($params['style']) )?$params['style']:null;
    $return = ( isset($params['return']) )?$params['return']:'img';
    $defaultDir = ( isset($params['dir']) )?$params['dir']: null ;


    if ( !filter_var($file, FILTER_VALIDATE_URL)) {
        $CI =& get_instance();

        if( $defaultDir ){
            $file = $defaultDir.DS.$file;
        }

        $url = $CI->config->item("base_url").($file);

        $url = str_replace('index.php/', null, $url);
    } else {
        $url = $file;
    }

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