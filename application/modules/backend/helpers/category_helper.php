<?php

function categoryGetId($alias=""){
    $ci = get_instance();
    $ci->load->model('backend/Category_Model');
    $row = $ci->Category_Model->get_item_by_alias($alias);
    return ( $row )? $row->id : 0;
}