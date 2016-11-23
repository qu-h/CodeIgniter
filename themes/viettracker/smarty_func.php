<?php
class viettracker_ui {
    function __construct(){

    }

    static function input_hidden(array $params = null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if( strlen($name) < 1 )
            return NULL;

        $value = isset($params['value']) ? $params['value'] : NULL;

        $html = '<input type="hidden" name="'.$name.'" value="'.$value.'" >';
        return $html;
    }
}