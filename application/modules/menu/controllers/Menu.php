<?php
if (! defined('BASEPATH')) exit('No direct script access allowed');

class Menu extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
        if( !method_exists($this, 'Menu_Model') ){
            $this->load->model('Menu_Model');

        }
        //$this->fields = $this->Menu_Model->fields();

    }

    public function navigation(){
        $items = $this->Menu_Model->get_menus($backend = 1, $level = 2);
        //bug($items);die;
        smarty_view("navigation",['items'=>$items,"uri_string"=>uri_string()]);
    }


}