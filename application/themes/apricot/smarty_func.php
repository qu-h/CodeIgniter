<?php
class apricot_ui {
    function __construct(){

    }

    static function inputToken(){
        $ci = get_instance();
        $params = array(
            'name'=>$ci->security->get_csrf_token_name(),
            'value'=>$ci->security->get_csrf_hash(),
        );
        return self::input_hidden($params);
    }

    static function formGroup($params=null,Smarty_Internal_Template  $template){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $field = isset($params['field']) ? $params['field'] : NULL;

        if( is_null($field) OR empty($field) ){
            $fields = $template->get_template_vars('fields');
            if( is_array($fields) AND array_key_exists($name, $fields) ){
                $field = $fields[$name];
            }

        }

        if( strlen($name) < 1 OR empty($field) )
            return NULL;


        if( !array_key_exists('type', $field) ){
            $field['type'] = 'text';
        }

        if( !isset($field['label']) ){
            $field['label'] = ucfirst($name);
        }

        if( isset($field['label']) && !isset($field['placeholder']) ){
            $field['placeholder'] = $field['label'];
        }
        $field['name'] = $name;
        $params['field'] = $field;

        $input_func = "input_".$field['type'];

        if(  is_array($function_registered = $template->registered_plugins['function']) AND array_key_exists($input_func, $function_registered) ){
            $html = self::$input_func($params['field']);
        } else {
            $html = self::input_text($params['field']);
        }

        if( $input_func=='input_hidden' ){
            return $html;
        } else {
            $output = '<div class="form-group">';
            $output.= '<label for="'.$name.'">'.$field['label'].'</label>';
            $output.= $html;
            $output.= '</div>';
            return $output;
        }


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
            $field['label'] = ucfirst($name);
        }

        if( isset($field['label']) && !isset($field['placeholder']) ){
            $field['placeholder'] = $field['label'];
        }
        $field['name'] = $name;
        $params['field'] = $field;

        $input_func = "input_".$field['type'];

        $function_registered = $template->registered_plugins['function'];

        if(  array_key_exists($input_func, $function_registered) ){
            return smartadmin_ui::$input_func($params['field']);
        } else {
            return smartadmin_ui::input_text($params['field']);
        }

    }

    static function row_input(array $params = null){

        if( !isset($params['html']) || strlen($params['html']) < 1 )
            return NULL;


        $html = null;
//         if( isset($params['label']) && strlen($params['label']) > 0 ){
//             $html.= '<label class="label">'.lang($params['label']).'</label>';
//         }

        $type_input = isset($params['class_type']) ? $params['class_type'] : 'input';

        $html.= '<label class="'.$type_input.'">';

        if( isset($params['icon']) && strlen($params['icon']) > 0 ){
            $html.= '<i class="icon-prepend fa fa-'.$params['icon'].'"></i>';
        }
        $html.= $params['html'];
        $html.= '</label>';

        if( isset($params['note']) && strlen($params['note']) > 0 ){
            $html.= '<div class="note">'.lang($params['note']).'</div>';
        }


        return '<section  class="smart-form" >'.$html.'</section>';

    }

    static function input_hidden(array $params = null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if( strlen($name) < 1 )
            return NULL;

        $value = isset($params['value']) ? $params['value'] : NULL;

        $html = '<input type="hidden" name="'.$name.'" value="'.$value.'" >';
        return $html;
    }

    static function input_text($params=null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if( strlen($name) < 1 )
            return NULL;

        $placeholder = isset($params['placeholder']) ? $params['placeholder'] : NULL;
        $maxlength = isset($params['maxlength']) ? $params['maxlength'] : 0;
        $value = isset($params['value']) ? $params['value'] : NULL;

        $params['html'] = '<input type="text" name="'.$name.'" value="'.$value.'" placeholder="'.$placeholder.'"  '.(intval($maxlength) > 0 ? ' maxlength="'.$maxlength.'"' : null).' class="form-control" >';
        return $params['html'];
    }

    static function input_select($params=null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;

        if( strlen($name) < 1 )
            return NULL;

        $params['html'] = '<select>
												<option value="0">Choose name</option>
												<option value="1">Alexandra</option>
												<option value="2">Alice</option>
												<option value="3">Anastasia</option>
												<option value="4">Avelina</option>
											</select>';
        $params['html'].= '<i class="icon"></i></label>';
        $params['class_type'] = 'select';
        return self::row_input($params);

    }

    static function input_textarea($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if( strlen($name) < 1 )
            return NULL;

        $value = isset($params['value']) ? trim($params['value']) : "";

        if( strlen($value) < 1){
            $value = "&nbsp;";
        }

        $html = NULL;
        if( isset($params['label']) && strlen($params['label']) > 0 ){
            $html.= '<section class="smart-form" ><header>'.$params['label'].'</header></section>';
        }

        $html.= '<textarea name="'.$name.'"  class="summernote">'.$value.'</textarea >';

        return $html;
    }
}