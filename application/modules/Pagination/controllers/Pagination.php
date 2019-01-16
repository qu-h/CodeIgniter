<?php if (! defined('BASEPATH')) exit('No direct script access allowed');


class Pagination extends MX_Controller
{
    function __construct($type='category')
    {
        parent::__construct();
    }

    function index(){
        $pagination = $this->smarty->getTemplateVars('pagination');
        $page_current = $pagination['current'];
        $page_item_begin = ($page_current-1)*$pagination['limit'];
        $page_item_end = ($page_current)*$pagination['limit'];
        $uri_string = uri_string();
        return temp_subview('pagination.tpl',compact('page_current','page_item_begin','page_item_end','uri_string'));
//        dd("html=".$html);
    }
}