<?php
class SmartadminInput_select extends CI_Smarty {

    static function input_select($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;
        if( !is_array($value) ){
            $value = [$value];
        }
        if (strlen($name) < 1){
            return NULL;
        }

        $options = '<option value="0" > -- No Value --</option>';
        if( isset($params["options"]) AND count($params["options"]) > 0 ){
            foreach ($params["options"] AS $v=>$t){
                if( is_array($t) ){
                    $options .= '<optgroup label="'.$v.'">';
                    foreach ($t AS $v2=>$t2){
                        $selected = in_array($v2,$value) ? 'selected="selected"' : NULL;
                        $options .= '<option value="'.$v2.'" '.$selected.' >'.$t2.'</option>';
                    }
                    $options .= '</optgroup>';
                } else {
                    $selected = in_array($v,$value) ? 'selected="selected"' : NULL;
                    $options .= '<option value="'.$v.'" '.$selected.' >'.$t.'</option>';
                }
            }
        }

        $input = '<select name="'.$name.'" >'.$options.'</select>';
        $html = '<section class="select">'.$input.'<i></i></section>';
        $params['html'] = $html;
        $params['label'] = NULL;
        $params['state'] = "state-success";
        return parent::fetchView("inputs/select",$params);
    }

    static function input_multiselect($params){
        return self::input_select($params);
    }

}