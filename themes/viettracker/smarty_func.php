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

    static function inputs($params=null,Smarty_Internal_Template  $template){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $field = isset($params['field']) ? $params['field'] : NULL;

        if( strlen($name) < 1 OR empty($field) )
            return NULL;


        if( !array_key_exists('type', $field) ){
            $field['type'] = 'text';
        }

        if( !isset($field['label']) ){
            $label = str_replace(array('_','-'), ' ', $name);
            $label = ucwords($label);
            $field['label'] = lang($label);
        }

        if( isset($field['label']) && !isset($field['placeholder']) ){
            $field['placeholder'] = $field['label'];
        }
        $field['name'] = $name;
        $params['field'] = $field;

        $input_func = "input_".$field['type'];

        $function_registered = $template->registered_plugins['function'];

        if(  array_key_exists($input_func, $function_registered) ){
            return viettracker_ui::$input_func($params['field']);
        } else {
            return viettracker_ui::input_text($params['field']);
        }

    }

    static function row_input(array $params = null){

        if( !isset($params['html']) || strlen($params['html']) < 1 )
            return NULL;
        $styleRow = isset($params['styleRow']) ? $params['styleRow'] : NULL;
        $desc = isset($params['desc']) ? $params['desc'] : NULL;

        $html = '<fieldset class="'.$styleRow.'" ><label>'.$params['label'].$desc.'</label><div class="clearfix">';
        $html.= $params['html'];
        if( isset($params['required']) && $params['required']){
            $html .= '<div class="required_tag tooltip hover left"></div>';
        }
        $html.='</div></fieldset>';

        return $html;


    }

    static function input_text($params=null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if( strlen($name) < 1 )
            return NULL;

        $placeholder = isset($params['placeholder']) ? $params['placeholder'] : NULL;
        $maxlength = isset($params['maxlength']) ? $params['maxlength'] : 0;
        $value = isset($params['value']) ? $params['value'] : NULL;

        $disabled = (isset($params['disabled']) AND $params['disabled'] ) ? ' disabled ' : NULL;

        $params['html'] = '<input type="text" name="'.$name.'" value="'.$value.'" placeholder="'.$placeholder.'"  '.(intval($maxlength) > 0 ? ' maxlength="'.$maxlength.'"' : null).' '.$disabled.' >';
        return self::row_input($params);
    }

    static function input_gender($params=null){
        $params['options'] = array(0=>lang('Male'),1=>lang('Female'));
        return self::input_select($params);
    }
    static function input_select($params=null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;

        if( strlen($name) < 1 )
            return NULL;

        $params['html'] = '<select name="'.$name.'" >';
        foreach ($params['options'] AS $k=>$title){
            $params['html'].= '<option value="'.$k.'" '.(( $k==$value )? 'selected' : NULL).' >'.$title.'</option>';
        }

        $params['html'].= '</select>';
//         $params['class_type'] = 'select';
        return self::row_input($params);

    }
}