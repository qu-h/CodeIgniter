<?php
class SmartadminInputs extends CI_Smarty
{
    static function row_input($params = null, $template=null)
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
            $icon = $params['icon'];
            if( preg_match('#^flag-#i', $icon) ) {
                $icon = "flag $icon";
            } else if( preg_match('#^fa-#i', $icon) ){
                $icon = "fa $icon";

            } else {
                $icon = "$icon";
            }
            $html .= '<i class="icon-prepend ' . $icon. '"></i>';
        }
        $html .= $params['html'];

        if (isset($params['icon-append']) && strlen($params['icon-append']) > 0) {
            $icon = $params['icon-append'];
            $iconShowText = false;
            if( preg_match('#^flag-#i', $icon) ) {
                $icon = "icon-append flag $icon";
            } else if( preg_match('#^fa-#i', $icon) ){
                $icon = "icon-append fa $icon";

            } else {
                $icon = "text-append";
                $iconShowText = true;
            }
            $html .= '<i class="' . $icon. '">'.($iconShowText ? $params['icon-append'] : null ).'</i>';
        }
        $html .= '</label>';

        if (isset($params['note']) && strlen($params['note']) > 0) {
            $html .= '<div class="note">' . lang($params['note']) . '</div>';
        }
        //return '<div class="row"><section>' . $html . '</section></div>';
        return '<section>' . $html . '</section>';
    }

    static function form_group_bootstrap(array $params = null){
        if (! isset($params['html']) || strlen($params['html']) < 1)
            return NULL;

        $html = null;

        $type_input = isset($params['class_type']) ? $params['class_type'] : 'input';
        $columns = isset($params['col']) ? $params['col'] : 9;

        $html .= '<label class="' . $type_input . '">';

        if (isset($params['icon']) && strlen($params['icon']) > 0) {
            $icon = $params['icon'];
            if( preg_match('#^flag-#i', $icon) ) {
                $icon = "flag $icon";
            } else if( preg_match('#^fa-#i', $icon) ){
                $icon = "fa $icon";

            } else {
                $icon = "fa fa-$icon";
            }
            $html .= '<i class="icon-prepend ' . $icon. '"></i>';
        }


        $out = '<div class="form-group">';
        $out.= '<label class="col-md-'.(12-$columns).' control-label">'.$params['title'].'</label>';
        $out.= '<div class="col-md-'.($columns).'">'.$params['html'].'</div>';
        $out.= '</div>';
        return $out;
    }

    static function text_addon($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $title = isset($params['title']) ? $params['title'] : NULL;
        $value = isset($params['value']) ? $params['value'] : NULL;
        $class = isset($params['class']) ? $params['class'] : NULL;

        if( isset($params['icon']) ){
            $icon = $params['icon'];
            if(  strpos($icon,'fa-') !== FALSE ){
                $icon = "fa $icon";
            } elseif ( strpos($icon,'glyphicon') !== FALSE ) {
                $icon = "glyphicon $icon";
            } else {
                $icon = "fa fa-$icon";
            }
            $params['icon'] = $icon;

            $icon = "<i class=\"".$params['icon']."\"></i>";
        } elseif (isset($params['txt_pre'])) {
            $icon = $params['txt_pre'];
        }
        $icon = '<span class="input-group-addon">'.$icon.'</span>';

        $inputAttribute = [
            'name'=>"$name",
            'value'=>"$value",
            'placeholder'=>"$title",
            'type'=>"text",
            'class'=>"form-control $class"
        ];
        $html = "<div class=\"input-group\">$icon <input "._stringify_attributes($inputAttribute)."/></div>";
        return $html;
    }

    static function inputs($params, Smarty_Internal_Template $template)
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

        if ( empty($field) || !is_array($field) || is_null($field) || !array_key_exists('type', $field)) {
            $field['type'] = 'text';
            switch ($name){
                case 'tags':
                    $field['type'] = 'tags';
                    break;
                case 'rate':
                    $field['type'] = 'stars';
                    break;
                case 'status':
                    $field['type'] = 'publish';
                    break;
            }
        }

        if( array_key_exists('label',$params) ){
            $field['label'] = $params['label'];
        } else if ( isset($field['label'])  ) {
            $field['label'] = ucfirst($name);
        }

        if (isset($field['label']) && ! isset($field['placeholder'])) {
            $field['placeholder'] = $field['label'];
        }
        $field['name'] = $name;

        if( isset($field['icon']) ){
            $icon = $field['icon'];
            if(  strpos($icon,'fa-') !== FALSE ){
                $icon = "fa $icon";
            } elseif ( strpos($icon,'glyphicon') !== FALSE ) {
                $icon = "glyphicon $icon";
            } else {
                $icon = "fa fa-$icon";
            }
            $field['icon'] = $icon;
        }

        $params['field'] = $field;

        $input_func = "input_" . $field['type'];

        $function_registered = $template->registered_plugins['function'];
        if (array_key_exists($input_func, $function_registered)) {
            return call_user_func_array($function_registered[$input_func][0],array($params['field'],$template));

        } else {
            return self::input_text($params['field']);
        }
    }

    static function form_group($params = null, Smarty_Internal_Template $template){
        $name = isset($params['name']) ? $params['name'] : NULL;
        $field = isset($params['field']) ? $params['field'] : NULL;
        $input_col = isset($params['col']) ? $params['col'] : 9;
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

        if ( empty($field) || is_null($field) || !array_key_exists('type', $field)) {
            $field['type'] = 'text';
        }

        if (! isset($field['label'])) {
            $field['label'] = ucfirst($name);
        }

        if (isset($field['label']) && ! isset($field['placeholder'])) {
            $field['placeholder'] = $field['label'];
        }
        $field['name'] = $name;
        $field['class'] = 'form-control';
        $params['field'] = $field;

        $input_func = "input_" . $field['type'];

        $function_registered = $template->registered_plugins['function'];

        if (array_key_exists($input_func, $function_registered)) {
            $params = call_user_func_array($function_registered[$input_func][0],array($params['field'],$template,true));
            $params['col'] = intval($input_col);
            return self::form_group_bootstrap($params,$template);
        } else {
            return self::input_text($params['field']);
        }
    }

    static function input_lable(array $params){
        if (! isset($params['html']) || strlen($params['html']) < 1)
            return NULL;

        $row = isset($params['row']) ? $params['row'] : TRUE;
        $content = $params['html'];
        $label = isset($params['label']) && strlen($params['label']) > 0 ? "<header>".$params['label']."</header>" : NULL;

        if( $row && strlen($label) > 0 ){
            return "<div class=\"row\" >$label $content</div>";
        } else {
            return $content;
        }
    }

    static function input_hidden(array $params = null)
    {
        $inputAttribute = [
            'name'=>'',
            'value'=>'',
            'type'=>'hidden',
            'class'=>''
        ];

        $inputAttribute = array_merge($inputAttribute, $params);

        if (strlen($inputAttribute['name']) < 1)
            return NULL;

        $field = isset($params['field']) ? $params['field'] : NULL;

        $value = NULL;
        if( empty($field) ){
            $fields = get_instance()->smarty->getTemplateVars("fields");
            if( array_key_exists($inputAttribute['name'],$fields) ){
                $field = $fields[$inputAttribute['name']];
                $inputAttribute = array_merge($inputAttribute, $field);
            }
        }
        $html = '<input '._stringify_attributes($inputAttribute).' >';
        return $html;
    }

    static function input_text($params = null, $template=[] ,$returnParams = false)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1){
            return NULL;
        }
        $input_attributes = [
            "type"=>"text",
            "name"=>$name,
            "value"=>isset($params['value']) ? $params['value'] : NULL,
            "placeholder"=>isset($params['placeholder']) ? $params['placeholder'] : NULL,
            //"class"=>isset($params['class']) ? $params['class'] : NULL
        ];

        if( isset($params['maxlength']) ) {
            $input_attributes["maxlength"] = $params['maxlength'];
        };
        if( isset($params['id']) ) {
            $input_attributes["id"] = $params['id'];
        };

        if( isset($params['class']) ) {
            $input_attributes["class"] = $params['class'];
        };

        if( isset($params['readonly']) ) {
            $input_attributes["readonly"] = $params['readonly'];
        };

        $attributes_params = isset($params['attributes']) ? $params['attributes'] : [];

        if( !empty($attributes_params) ){
            foreach ($attributes_params AS $k=>$v){
                if( $v === NULL && array_key_exists($k,$input_attributes)){
                    unset($input_attributes[$k]);
                } else if ( !is_null($v) ){
                    $input_attributes[$k] = $v;
                }
            }
        }

        $params['html'] = '<input '._stringify_attributes($input_attributes).'>';
        return $returnParams ? $params : self::row_input($params);
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

        $value = isset($params['value']) ? trim($params['value']) : "";
        $editor= isset($params['editor']) ? $params['editor'] : "ict-ckeditor";

        if( in_array($editor,['ckeditor','ict-ckeditor'])){
            $js = git_assets('ckeditor.js','ckeditor','4.10.0',null,false);
            add_js($js);
//            $editor_config = git_assets('config/giaiphapict.js','ckeditor','4.10.0',null,false);
//            add_js("ckeditor.config.js");
        }
        $attributes = [
            'name'=>$name,
            'class'=>$editor,
            'rows'=>  isset($params['rows']) ? $params['rows'] : 3
        ];
        if( isset($params['rows']) ){
            $attributes['rows'] = $params['rows'];
        }

        if( isset($params['placeholder']) ){
            $attributes['placeholder'] = $params['placeholder'];
        }

        $params['html'] = '<textarea '._stringify_attributes($attributes).'>' . $value . '</textarea >';
        if( $editor =='row_input' ){
            $params["class_type"] = "textarea";
            return self::row_input($params);
        }
        return self::row_input($params);
//        return self::input_lable($params);
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

    static function input_crawler_link($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1)
            return NULL;

        $params['placeholder'] = isset($params['placeholder']) ? $params['placeholder'] : NULL;
        $maxlength = isset($params['maxlength']) ? $params['maxlength'] : 0;
        $params['value'] = isset($params['value']) ? $params['value'] : NULL;
        return parent::fetchView("inputs/crawler_link",$params);
    }

    static function input_date($params)
    {
        $name = isset($params['name']) ? $params['name'] : NULL;
        $label = isset($params['label']) ? $params['label'] : NULL;
        if (strlen($name) < 1)
            return NULL;

        $value = isset($params['value']) ? trim($params['value']) : "&nbsp;";
        if (strlen($value) < 1) {
            $value = "";
        }
        $editor = isset($params['editor']) ? $params['editor'] : "ckeditor";

        $params['html'] = '<label class="input"> <i class="icon-prepend fa fa-calendar"></i>
											<input type="text" name="'.$name.'" placeholder="'.$label.'" class="datepicker" data-dateformat=\'dd/mm/yy\'>
										</label>';
        return self::input_lable($params);
    }

    static function input_price($params){
        $params["type"] = 'text';
        $params["attributes"] = [
            'data-bv-field'=>"price"
        ];
        $params["icon-append"] = isset($params["unit"]) ? $params["unit"] : "$";
        if( isset($params['short']) ){
            $params["icon-append"] = $params["short"].$params["icon-append"];
        }
        return self::input_text($params);
    }

    static function input_editable($params){
        if( !array_key_exists('value',$params) ){
            $params['value'] = null;
        }
        return parent::fetchView("inputs/editable",$params);
    }

    static function input_news_link($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1)
            return NULL;
        return parent::fetchView("inputs/news_link",$params);
    }

    static function input_source_link($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1)
            return NULL;
        return parent::fetchView("inputs/source_link",$params);
    }

}