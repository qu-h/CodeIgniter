<?php

class SmartadminInput_element extends CI_Smarty {

    static function input_stars($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : [];

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

        $html = "<section><div class=\"rating\">$stars ".$params['label']."</div></section>";
        return $html;
    }

    static function input_publish($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1){
            return NULL;
        }
        $input_attributes = array(
            "type"=>"text",
            "name"=>$name,
            "value"=>isset($params['value']) ? $params['value'] : NULL,
            "placeholder"=>isset($params['placeholder']) ? $params['placeholder'] : NULL
        );
        $checked = $input_attributes['value'] ? 'checked' : null;
        $input = '<input type="checkbox" name="'.$name.'" '.$checked.'>';
        $input.= '<i data-swchon-text="'.lang("Publish").'" data-swchoff-text="'.lang("Unpublish").'"></i>';

        $html = '<div class="toggle">'.lang($input_attributes['placeholder']).$input.'</div>';
        //return self::row_input($params);
        return $html;
    }
}