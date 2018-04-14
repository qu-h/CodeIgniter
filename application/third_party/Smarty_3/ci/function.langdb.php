<?php
function smarty_function_langdb($params){
    if( isset($params['id']) ){
        $ci =&get_instance();

        $lang = 'vn';

        $lang_item = $ci->Lang_Model->line_by_id($params['id']);

        if( $lang_item && $lang_item->language==$lang ){
            return $lang_item->content;
        }

    }


}
