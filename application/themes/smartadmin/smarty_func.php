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
        $attributes = [
            'class'=>$is_btn ? "btn btn-success btn-xs" : null
        ];
        if( isset($template['id']) ){
            $attributes['id'] = $template['id'];
        }
        if ($txt) {
            $title = lang($txt);
            if( strlen($icon) > 0 ){
                $title = "<i class=\"glyphicon glyphicon-$icon\"></i>$title";
            }
            return anchor($uri,$title,$attributes);
        } else if ( isset($template['btn-template']) ){
            $template_return = $template['btn-template'];
            $template_return['is_btn'] = true;
            return self::button_anchor($template_return);
        }
    }

    static function notification($params = null)
    {
        $html = NULL;
        $session = get_instance()->session;

        if ($session->flashdata('error')) {
            $html .= self::msg(array(
                'content' => $session->flashdata('error'),
                'title'=>'Error'
            ));
        } else if ($session->flashdata('success')) {
            $html .= self::msg(array(
                'content' => $session->flashdata('success'),
                'title'=>'Success'
            ));
        }

        return $html;
    }

    static function msg($params = null)
    {
        $content = isset($params['content']) ? $params['content'] : '';
        $title = isset($params['title']) ? $params['title'] : 'Check validation';

        $html = '<div class="alert alert-block alert-success">
            	<a href="#" data-dismiss="alert" class="close">x</a>
            	<h4 class="alert-heading"><i class="fa fa-check-square-o"></i> '.$title.'!</h4>
            	<p>' . $content . '</p>
            </div>';
        return $html;
    }

    static function input_hidden($params){
        $name = isset($params['name']) ? $params['name'] : NULL;
        if (strlen($name) < 1){
            return NULL;
        }
        $attributes = [
            'type'=>'hidden',
            'name'=>$name
        ];
        if( isset($params['value']) ){
            $attributes['value'] = $params['value'];
        }
        return '<input '._stringify_attributes($attributes).'>';
    }
}