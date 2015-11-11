<?php
function smarty_function_inputs_lang($params,$content,$template=null, &$repeat=null){
    if( isset($params['lang']) ){
        $lang = $params['lang'];
//         switch ($lang){
//             case 'vn':
//                 $lang = 'vietnam'; break;
//             default:
//                 $lang = 'english'; break;
//         }
        $fields = $content->tpl_vars['fields'];

        $theme = $content->theme_ui;

        $html = NULL;

        foreach ($fields->value AS $k=>$f){
            if( isset($f['lang']) &&  $f['lang'] ){
                $f['key'] = $k;
                $f['title'] = lang($f['title'],null,null,$lang);
                $f['value'] = ( isset($f['value'][$lang]) ) ? $f['value'][$lang] : null;


                $html .= $theme->input_icon($k."[$lang]",$f);

            }
        }
        return $html;
    }

}