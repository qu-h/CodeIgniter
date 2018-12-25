<?php

class SmartadminInput_element extends CI_Smarty {

    static function input_stars($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : [];
        $label = isset($params['label']) ? $params['label'] : NULL;

        if (strlen($name) < 1){
            return NULL;
        }
        $stars = '';
        for($i=0; $i<=5; $i++ ){
            $inputAttributes = [
                'type'=>"radio",
                'name'=>$name,
                'id'=>$name.$i,
                'value'=>$i
            ];
            if( $value == $i ){
                $inputAttributes['checked'] = true;
            }
            $stars .= '<input '._stringify_attributes($inputAttributes).' ><label for="'.$name.$i.'"><i class="fa fa-star"></i></label>';
        }

        $html = "<section><div class=\"rating\">$stars ".$label."</div></section>";
        return $html;
    }

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
        //return self::row_input($params);
        return $html;
    }
}