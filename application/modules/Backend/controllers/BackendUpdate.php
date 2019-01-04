<?php
class BackendUpdate extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    function index(){
        self::Date20181230();
    }

    private function Date20181230(){
        if ( !$this->db->field_exists('hidden', 'menus'))
        {
            $this->db->query("ALTER TABLE `menus` ADD `hidden` TINYINT(1) NOT NULL DEFAULT '0' AFTER `status`;");
        }
    }
}