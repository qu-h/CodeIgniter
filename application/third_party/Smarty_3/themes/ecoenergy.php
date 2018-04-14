<?php defined('BASEPATH') OR exit('No direct script access allowed');
class ecoenergy_theme {
    function __construct(){

    }

    static function sc_line(){
        $html = '<div class="vc_row wpb_row vc_row-fluid vc_row-no-padding" data-vc-stretch-content="true" data-vc-full-width-init="true" data-vc-full-width="true" style="position: relative; left: -159.5px; box-sizing: border-box; width: 1349px;">';
        $html.=     '<div class="wpb_column vc_column_container vc_col-sm-12">';
        $html.=         '<div class="wpb_wrapper">';
        $html.=             '<div style="margin-top:0.15em;margin-bottom:3.5em;border-top-style:solid;" class="sc_line sc_line_style_solid"></div>';
        $html.= '</div></div></div>';
        return $html;

    }
}