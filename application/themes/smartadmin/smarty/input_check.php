<?php

class SmartadminInput_check extends CI_Smarty {
    static function input_publish($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1){
            return NULL;
        }
        $inputAttributes = array(
            "type"=>"checkbox",
            "name"=>$name,
            "value"=>isset($params['value']) ? $params['value'] : NULL,
            "placeholder"=>isset($params['placeholder']) ? $params['placeholder'] : NULL
        );
        if( $inputAttributes['value'] ){
            $inputAttributes['checked'] = 'checked';
        }

        $input = '<input '._stringify_attributes($inputAttributes).'>';
        $input.= '<i data-swchon-text="'.lang("Publish").'" data-swchoff-text="'.lang("Unpublish").'"></i>';

        $html = '<label class="toggle w80">'.$input.lang($inputAttributes['placeholder']).'</label>';

        return parent::fetchView("inputs/publish",$params);

        //return self::row_input($params);
        //return $html;
    }
}