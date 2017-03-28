<?php

class smartadmin_ui
{

    function __construct()
    {

    }

    static function button_anchor($template = null, $params = null)
    {
        $icon = (isset($template['icon']) and $template['icon'] != "") ? $template['icon'] : 'plus';
        $txt = isset($template['txt']) ? $template['txt'] : NULL;

        $uri_add = isset($template['uri_add']) ? $template['uri_add'] : NULL;
        if (strlen($uri_add) > 1) {
            $uri = get_instance()->uri->uri_string() . DS . $uri_add;
        } else {
            $uri = isset($template['uri']) ? $template['uri'] : NULL;
        }

        if ($txt) {
            return '<a class="btn btn-success btn-xs" href="' . site_url($uri) . '"><i class="glyphicon glyphicon-' . $icon . '"></i> ' . lang($txt) . '</a>';
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

        if (strlen($name) < 1 or empty($field))
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

// bug($function_registered);die;
        if (array_key_exists($input_func, $function_registered)) {
            return call_user_func_array($function_registered[$input_func][0],array($params['field']));
            ;
//             return smartadmin_ui::$input_func($params['field']);
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
        if (strlen($name) < 1)
            return NULL;

        $placeholder = isset($params['placeholder']) ? $params['placeholder'] : NULL;
        $maxlength = isset($params['maxlength']) ? $params['maxlength'] : 0;
        $value = isset($params['value']) ? $params['value'] : NULL;

        $params['html'] = '<input type="text" name="' . $name . '" value="' . $value . '" placeholder="' . $placeholder . '"  ' . (intval($maxlength) > 0 ? ' maxlength="' . $maxlength . '"' : null) . ' >';
        return self::row_input($params);
    }

    static function input_text_addon_str($params = null){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;
        $addon = isset($params['addon']) ? $params['addon'] : NULL;
        if( strpos($addon,'fa-') !== false ){
            $addon = '<li class="fa '.$addon.'"></li>';
        }
        $params['html'] = '<div class="input-group"><span class="input-group-addon">'.$addon.'</span><input type="text" class="form-control" name="'.$name.'" value="'.$value.'"></div>';

        return self::input_lable($params);
    }

    static function input_select($params = null)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;

        if (strlen($name) < 1)
            return NULL;

        $input = '<select>
												<option value="0">Choose name</option>
												<option value="1">Alexandra</option>
												<option value="2">Alice</option>
												<option value="3">Anastasia</option>
												<option value="4">Avelina</option>
											</select>';

        $html = '<section class="select">'.$input.'<i></i></section>';

        $params['html'] = $html;

        $params['label'] = NULL;
        return self::input_lable($params);
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
        }
        $params['html'] = '<textarea name="' . $name . '"  class="summernote">' . $value . '</textarea >';
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

    static function menu_navigation($params)
    {
        $db = get_instance()->db;
        $db->from('menus')
            ->where('parent', 0)
            ->where('status', 1);
        $menus = $db->order_by('order ASC')->get();

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


}