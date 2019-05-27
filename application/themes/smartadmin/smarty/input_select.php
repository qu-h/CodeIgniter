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

    static function input_multi_select($params){
        return self::input_select($params);
    }

    static function input_select_category($params){
        $ci = get_instance();
        $ci->load->model('SystemCategory/SystemCategoryModel');
        if( !isset($params['category-type']) ){
            $params['category-type'] = 'category';
        }
        $without_ids = [];
        if( array_key_exists('without_ids',$params) ){
            $without_ids = $params['without_ids'];
        }
        $params['options'] = $ci->SystemCategoryModel->load_options($params['category-type'],1,$without_ids,2);
        return self::input_select2($params);
        //return self::input_multi_select($params);
    }

    static function input_select2($params = null){
        if( !isset($params['value']) ){
            $params['value'] = [];
        } else if ( is_numeric($params['value']) || is_string($params['value']) ){
            $params['value'] = [$params['value']];
        }
        $params['label'] = NULL;
        $params['state'] = "state-success";
        if( !array_key_exists('optgroup',$params) ){
            $params['optgroup'] = true;
        }
        return parent::fetchView("inputs/select2",$params);

    }

    static function input_select_category_tag($params=[]){
        $ci = get_instance();
        $ci->load->model('SystemTag/SystemTagModel');
        if( !isset($params['category-type']) ){
            $params['category-type'] = 'category';
        }
        $without_ids = [];
        if( array_key_exists('without_ids',$params) ){
            $without_ids = $params['without_ids'];
        }
        $params['options'] = $ci->SystemTagModel->load_options(null,$without_ids,$level=2);
        $params['optgroup'] = false;
        return self::input_select2($params);
    }

    static function input_tags($params = [])
    {
        $ci = get_instance();
        $ci->load->model('SystemTag/SystemTagModel');
        if( !array_key_exists('tag-type',$params) ){
            $params['tag-type'] = FALSE;
        }
        $params['options'] = $ci->SystemTagModel->load_options($status=1,$idsUsing=[],$level=2);
        return self::input_select2($params);
        //return parent::fetchView("inputs/tags-input",$params);
    }

    static function input_multiple_image($params = null){
        if( !isset($params['value']) ){
            $params['value'] = [];
        } else if ( is_numeric($params['value']) || is_string($params['value']) ){
            $params['value'] = [$params['value']];
        }

        $params['label'] = NULL;
        $params['state'] = "state-success";
        return parent::fetchView("inputs/multiple_image",$params);
    }

}