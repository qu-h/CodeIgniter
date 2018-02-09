<?php

function categoryGetId($alias=""){
    $ci = get_instance();
    $ci->load->model('backend/Category_Model');
    $row = $ci->Category_Model->get_item_by_alias($alias);
    return ( $row )? $row->id : 0;
}

function load_category_options($type='article',$status=1,$using_id=[],$level=1,$parent_id=0){
    $ci = get_instance();
    $ci->load->model('backend/Category_Model');
    return $ci->Category_Model->load_options($type,$status,$using_id,$level,$parent_id);
}