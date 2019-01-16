<?php
class MenuUpdate extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    function index(){
        self::Date20190113();
    }

    private function Date20190113(){
        if ( !$this->db->field_exists('summary', 'menus'))
        {
            $this->db->query("ALTER TABLE `menus` ADD `summary` TEXT AFTER `icon`;");
        }
        if ( !$this->db->field_exists('content', 'menus'))
        {
            $this->db->query("ALTER TABLE `menus` ADD `content` TEXT AFTER `summary`;");
        }
        if ( !$this->db->field_exists('description', 'menus'))
        {
            $this->db->query("ALTER TABLE `menus` ADD `description` TEXT AFTER `content`;");
        }
    }
}