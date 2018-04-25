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

}