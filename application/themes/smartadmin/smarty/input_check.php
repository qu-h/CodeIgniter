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

        if ( $params['value'] ){
            $params['checked'] = 'checked';
        }

        if( isset($params['label']) != true )  {
            $params['label'] = lang("Public");
        }


        return parent::fetchView("inputs/publish",$params);


    }
}