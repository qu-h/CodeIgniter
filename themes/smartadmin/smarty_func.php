<?php
class smartadmin_ui {
    function __construct(){

    }

    static function button_anchor($template=null, $params=null){
        $icon = (isset($template['icon']) AND $template['icon']!="" ) ? $template['icon'] : 'plus';
        $txt = isset($template['txt']) ? $template['txt'] : NULL;


        $uri_add = isset($template['uri_add']) ? $template['uri_add'] : NULL;
        if( strlen($uri_add) > 1 ){
            $uri = get_instance()->uri->uri_string().DS.$uri_add;
        } else {
            $uri = isset($template['uri']) ? $template['uri'] : NULL;
        }

        if( $txt ){
            return '<a class="btn btn-success btn-xs" href="'.site_url($uri).'"><i class="glyphicon glyphicon-'.$icon.'"></i> '.lang($txt).'</a>';
        }
    }

    static function notification($params=null){
        $html = NULL;

        $session = get_instance()->session;
        if( $session->flashdata('error') ){
            $html.= self::msg(array('content'=>$session->flashdata('error')));
        }

        return $html;
    }

    static function msg($params=null){
        $content = isset($params['content']) ? $params['content'] : '';

        $html = '<div class="alert alert-block alert-success">
            	<a href="#" data-dismiss="alert" class="close">�</a>
            	<h4 class="alert-heading"><i class="fa fa-check-square-o"></i> Check validation!</h4>
            	<p>'.$content.'</p>
            </div>';
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

        $params['html'] = '<input type="text" name="'.$name.'" value="'.$value.'" placeholder="'.$placeholder.'"  '.(intval($maxlength) > 0 ? ' maxlength="'.$maxlength.'"' : null).' >';
        return self::row_input($params);
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

    static function input_MultiImage($params){
        get_instance()->smarty->add_js('multi_images.js');

        $name = isset($params['name']) ? $params['name'] : NULL;
        if( strlen($name) < 1 )
            return NULL;

        $value = isset($params['value']) ? trim($params['value']) : "";


        $html ='<output id="imgs_thumb" class="row">';

        if( strlen($value) > 0 ){
            $url_dir = get_instance()->form->img_upload_url;
            $images = unserialize($value);
            if( !empty($images) ) foreach ($images AS $img){
                $html .= '<div class="col-sm-6 col-md-6 col-lg-6" >
                        <img class="thumb" src="'.$url_dir.$img.'" title="" />
                        <input type="hidden" name="'.$name.'[]" value="'.$img.'"  />
                        </div>';
            }
        }
		$html.='</output>';
        $html.= '<section class="smart-form"> <div class="input input-file">
					<span class="button">
					<input type="file" id="files" multiple>Browse</span>
					<input type="text" placeholder="Include some files" readonly="" >
				</div></section>';

        return $html;
    }
}