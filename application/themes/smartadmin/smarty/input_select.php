<?php
class SmartadminInput_select extends CI_Smarty {

    static function input_select($params = null)
    {
        if( !isset($params['value']) ){
            $params['value'] = [];
        } else if ( is_numeric($params['value']) || is_string($params['value']) ){
            $params['value'] = [$params['value']];
        }
        $params['label'] = NULL;
        $params['state'] = "state-success";
        return parent::fetchView("inputs/select",$params);
    }

    static function input_multiselect($params){
        return self::input_select($params);
    }

    static function input_select_category($params){
        $ci = get_instance();
        $ci->load->model('Category/Category_Model');
        if( !isset($params['category-type']) ){
            $params['category-type'] = 'category';
        }
        $params['options'] = $ci->Category_Model->load_options($params['category-type'],1,[],2);

        return self::input_select($params);
    }

    static function input_select2($params = null){
        if( !isset($params['value']) ){
            $params['value'] = [];
        } else if ( is_numeric($params['value']) || is_string($params['value']) ){
            $params['value'] = [$params['value']];
        }

        $params['label'] = NULL;
        $params['state'] = "state-success";
        return parent::fetchView("inputs/select2",$params);

    }
    static function input_tags($params = null)
    {
        $ci = get_instance();
        $ci->load->model('Tag/Tag_Model');
        if( !array_key_exists('tag-type',$params) ){
            $params['tag-type'] = FALSE;
        }
        $params['options'] = $ci->Tag_Model->load_options($params['tag-type'],1,[],2);
        return self::input_select2($params);
    }

}