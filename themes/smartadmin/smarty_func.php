<?php

class smartadmin_ui
{

    function __construct()
    {

    }

    static function button_anchor($template = null, $params = null)
    {
        $icon = (isset($template['icon']) and $template['icon'] != "") ? $template['icon'] : null;
        $txt = isset($template['txt']) ? $template['txt'] : NULL;
        $is_btn = isset($template['is_btn']) ? $template['is_btn'] : false;

        $uri_add = isset($template['uri_add']) ? $template['uri_add'] : NULL;
        if (strlen($uri_add) > 1) {
            $uri = get_instance()->uri->uri_string() . DS . $uri_add;
        } else {
            $uri = isset($template['uri']) ? $template['uri'] : NULL;
        }

        if ($txt) {
            $anchor_class = $is_btn ? "btn btn-success btn-xs" : null;
            $html =  "<a class=\"$anchor_class\" href=\"" . site_url($uri) . "\">" ;
            if( strlen($icon) > 0 ){
                $html .= "<i class=\"glyphicon glyphicon-$icon\"></i>";
            }
            $html .= lang($txt) . '</a>';
            return $html;
        }
    }

    static function notification($params = null)
    {
        $html = NULL;

        $session = get_instance()->session;
        if ($session->flashdata('error')) {
            $html .= self::msg(array(
                'content' => $session->flashdata('error')
            ));
        }

        return $html;
    }

    static function msg($params = null)
    {
        $content = isset($params['content']) ? $params['content'] : '';

        $html = '<div class="alert alert-block alert-success">
            	<a href="#" data-dismiss="alert" class="close">�</a>
            	<h4 class="alert-heading"><i class="fa fa-check-square-o"></i> Check validation!</h4>
            	<p>' . $content . '</p>
            </div>';
        return $html;
    }

    static function inputs($params = null, Smarty_Internal_Template $template)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $field = isset($params['field']) ? $params['field'] : NULL;
        if( empty($field) ){
            $fields = get_instance()->smarty->getTemplateVars("fields");
            if( array_key_exists($name,$fields) ){
                $field = $fields[$name];
            } else {
                $field = ['type'=>'text'];
            }
        }

        if (strlen($name) < 1 )
            return NULL;

        if (! array_key_exists('type', $field)) {
            $field['type'] = 'text';
        }

        if (! isset($field['label'])) {
            $field['label'] = ucfirst($name);
        }

        if (isset($field['label']) && ! isset($field['placeholder'])) {
            $field['placeholder'] = $field['label'];
        }
        $field['name'] = $name;
        $params['field'] = $field;

        $input_func = "input_" . $field['type'];

        $function_registered = $template->registered_plugins['function'];

        if (array_key_exists($input_func, $function_registered)) {
            return call_user_func_array($function_registered[$input_func][0],array($params['field']));
            ;
        } else {
            return smartadmin_ui::input_text($params['field']);
        }
    }

    static function row_input(array $params = null)
    {
        if (! isset($params['html']) || strlen($params['html']) < 1)
            return NULL;

        $html = null;
        // if( isset($params['label']) && strlen($params['label']) > 0 ){
        // $html.= '<label class="label">'.lang($params['label']).'</label>';
        // }

        $type_input = isset($params['class_type']) ? $params['class_type'] : 'input';

        $html .= '<label class="' . $type_input . '">';

        if (isset($params['icon']) && strlen($params['icon']) > 0) {
            $html .= '<i class="icon-prepend fa fa-' . $params['icon'] . '"></i>';
        }
        $html .= $params['html'];
        $html .= '</label>';

        if (isset($params['note']) && strlen($params['note']) > 0) {
            $html .= '<div class="note">' . lang($params['note']) . '</div>';
        }
        return '<div class="row"><section>' . $html . '</section></div>';
    }

    static function input_lable(array $params){
        if (! isset($params['html']) || strlen($params['html']) < 1)
            return NULL;

        $row = isset($params['row']) ? $params['row'] : TRUE;
        $content = $params['html'];
        $label = isset($params['label']) ? "<header>".$params['label']."</header>" : NULL;



        if( $row ){
            return "<div class=\"row\" >$label $content</div>";
        } else {
            return "<div class=\"row\" >$label $content</div>";
        }
    }

    static function input_hidden(array $params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1)
            return NULL;

        $value = isset($params['value']) ? $params['value'] : NULL;

        $html = '<input type="hidden" name="' . $name . '" value="' . $value . '" >';
        return $html;
    }

    static function text_addon($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $title = isset($params['title']) ? $params['title'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;

        if( isset($params['icon']) ){
            $icon = "<i class=\"fa ".$params['icon']."\"></i>";
        } elseif (isset($params['txt_pre'])) {
            $icon = $params['txt_pre'];
        }
        $icon = '<span class="input-group-addon">'.$icon.'</span>';

        $html = "<div class=\"input-group\">$icon <input name=\"$name\" value=\"$value\" placeholder=\"$title\" type=\"text\" class=\"form-control\" ></div>";
        return $html;
    }

    static function input_text($params = null)
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
            
        if( isset($params['maxlength']) ) {
            $input_attributes["maxlength"] = $params['maxlength'];
        };
        if( isset($params['id']) ) {
            $input_attributes["id"] = $params['id'];
        };
        
        if( isset($params['class']) ) {
            $input_attributes["class"] = $params['class'];
        };


        $params['html'] = '<input '._stringify_attributes($input_attributes).'>';
        return self::row_input($params);
    }

    static function input_text_addon_str($params = null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;
        $addon = isset($params['addon']) ? $params['addon'] : NULL;
        $input_class = isset($params['class']) ? $params['class'] : NULL;
        $input_class .= " form-control"; 
        if( strpos($addon,'fa-') !== false ){
            $addon = '<li class="fa '.$addon.'"></li>';
        }
        $params['html'] = '<div class="input-group"><span class="input-group-addon">'.$addon.'</span><input type="text" class="'.$input_class.'" name="'.$name.'" value="'.$value.'"></div>';

        return self::input_lable($params);
    }

    static function input_select($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;

        if (strlen($name) < 1){
            return NULL;
        }
        $options = '<option value="0" > -- No Value --</option>';
        if( isset($params["options"]) AND count($params["options"]) > 0 ){
            foreach ($params["options"] AS $v=>$t){
                $selected = $value == $v ? 'selected="selected"' : NULL;
                $options .= '<option value="'.$v.'" '.$selected.' >'.$t.'</option>';
            }
        }
            
        $input = '<select name="'.$name.'" >'.$options.'</select>';
        $html = '<section class="select">'.$input.'<i></i></section>';
        $params['html'] = $html;

        $params['label'] = NULL;
        return self::input_lable($params);
    }
    
    static function input_tags($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;
    
        if (strlen($name) < 1){
            return NULL;
        }
        $options = '';
        if( isset($params["options"]) AND count($params["options"]) > 0 ){
            foreach ($params["options"] AS $v ){
                
                $options .= '<option value="'.$v.'" >'.$v.'</option>';
            }
        }
    
        $input = '<select name="'.$name.'[]" multiple="multiple" data-role="tagsinput"  >'.$options.'</select>';
        $html = '<section class="select" >'.$input.'</section>';
        return $html;
    }

    static function input_select_fromDB($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;
        $options = isset($params['options']) ? $params['options'] : NULL;

        if (strlen($name) < 1)
            return NULL;

        $input = '<select name="'.$name.'" >';
        if( !empty($options) ) foreach ($options as $ite) {
            $input .= '<option value="'.$ite->id.'" '.($ite->id ==$value ? 'selected="selected"' : NULL ).' >'.$ite->title.'</option>';
        }

        $input .= '</select>';

        $html = '<label class="select">'.$input.'<i></i></label>';
        return $html;
    }

    static function input_textarea($params)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1)
            return NULL;

        $value = isset($params['value']) ? trim($params['value']) : "&nbsp;";
        if (strlen($value) < 1) {
            $value = "&nbsp;";
            $value = "";
        }
        $editor = isset($params['editor']) ? $params['editor'] : "ckeditor";

        $params['html'] = '<textarea name="' . $name . '"  class="'.$editor.'">' . $value . '</textarea >';
        return self::input_lable($params);
    }

    static function input_MultiImage($params)
    {
        get_instance()->smarty->add_js('multi_images.js');

        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1)
            return NULL;

        $value = isset($params['value']) ? trim($params['value']) : "";

        $html = '<output id="imgs_thumb" class="row">';

        if (strlen($value) > 0) {
            $url_dir = get_instance()->form->img_upload_url;
            $images = unserialize($value);
            if (! empty($images))
                foreach ($images as $img) {
                    $html .= '<div class="col-sm-6 col-md-6 col-lg-6" >
                        <img class="thumb" src="' . $url_dir . $img . '" title="" />
                        <input type="hidden" name="' . $name . '[]" value="' . $img . '"  />
                        </div>';
                }
        }
        $html .= '</output>';
        $html .= '<section class="smart-form"> <div class="input input-file">
					<span class="button">
					<input type="file" id="files" multiple>Browse</span>
					<input type="text" placeholder="Include some files" readonly="" >
				</div></section>';

        return $html;
    }

    static function input_image($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;

        if (strlen($name) < 1){
            return NULL;
        }

        $input = '<input class="btn btn-default" id="exampleInputFile1" type="file">';
        //$html = '<section class="select">'.$input.'<i></i></section>';
        $params['html'] = $input;

        $params['label'] = NULL;
        return self::input_lable($params);
    }

    static function menu_navigation($params)
    {
        if( !isset(get_instance()->db) ){
            return;
        }
        $db = get_instance()->db;
        $db->from('menus')
            ->where('parent', 0)
            ->where('backend', 1)
            ->where('status', 1);
        $menus = $db->order_by('order ASC')->get();

        if( !$menus ){
            return NULL;
        }
        $html = '<ul>';
        if ($menus->num_rows() > 0)
            foreach ($menus->result() as $m1) {
                $label = '<span class="menu-item-parent">' . lang($m1->name) . '</span>';
                if (strlen($m1->icon) > 0) {
                    $label = '<i class="fa fa-lg fa-fw ' . $m1->icon . '"></i>' . $label;
                }

                $current_uri = uri_string();
                //if (strpos(uri_string(), strval($m1->uri), 0) !== false ) {
                if( strlen($m1->uri) > 0 AND substr($current_uri, 0, strlen($m1->uri)) == $m1->uri ) {
                    $html .= '<li class="active" >';
                } else {
                    $html .= '<li>';
                }



                $submenus = $db->from('menus')
                    ->where(array(
                    'status' => 1,
                    'parent' => $m1->id
                ))
                    ->order_by('order')
                    ->get();


                if ($submenus->num_rows() > 0) {
                    $html .= anchor(NULL, $label);
                    $html .= '<ul>';
                    foreach ($submenus->result() as $m2) {
                        if (strlen($m2->icon) > 0) {
                            $label = '<i class="fa fa-lg fa-fw ' . $m2->icon . '"></i>' . lang($m2->name);
                        } else {
                            $label = $m2->name;
                        }
                        $actived = NULL;
                        if(  $current_uri == $m2->uri ) {
                            $actived = 'class="active"';
                        }
                        $html .= "<li $actived>" . anchor($m2->uri, $label) . "</li>";


                    }
                    $html .= '</ul>';
                } else {
                    $html .= anchor($m1->uri, $label);
                }
                $html .= '</li>';
            }

        $html .= '</ul>';
        return $html;
    }

    static function input_crawler_link($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1)
            return NULL;
        
            $placeholder = isset($params['placeholder']) ? $params['placeholder'] : NULL;
            $maxlength = isset($params['maxlength']) ? $params['maxlength'] : 0;
            $value = isset($params['value']) ? $params['value'] : NULL;
        
//             $params['class_type'] = "input-group";
            
            $params["html"] = "";
//             if( strlen($params['icon']) > 0 ){
//                 $params["html"].= '<span class="input-group-addon"><i class="fa fa-'.$params['icon'].'"></i></span>';
//                 $params['icon'] = NULL;
//             }
            
            $params['html'].= '<input type="text" name="' . $name . '" value="' . $value . '" placeholder="' . $placeholder . '"  ' . (intval($maxlength) > 0 ? ' maxlength="' . $maxlength . '"' : null) . ' >';
            
            $params['html'].= '<i class="icon-append fa fa-check submit"></i>';
            return self::row_input($params);
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

        $params['html'] = '<header class="toggle">'.$input_attributes['placeholder'].$input.'</header>';
        return self::row_input($params);
    }

}