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


}