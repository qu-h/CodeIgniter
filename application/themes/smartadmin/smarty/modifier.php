<?php

class SmartadminModifier extends CI_Smarty {
    static function modifier_uri_begin_with($param,$temp_val){
        return (strpos(strtolower($param), strtolower($temp_val)) === 0);
    }

    static function modifier_uri_begin_with_uri_first($param){
        $uri_first = get_instance()->uri->segment(1);
        return self::modifier_uri_begin_with($param,$uri_first);

    }
}