<?php

/**
 * Class UpdateBackend
 * @property CI_DB_driver $db
 */

class UpdateBackend extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    public function index(){
        $this->create_menus();
    }

    private function create_menus(){
        if ( !$this->db->table_exists('menus'))
        {
            $this->db->query("CREATE TABLE IF NOT EXISTS `menus` (
                              `id` int(11) NOT NULL AUTO_INCREMENT,
                              `name` varchar(100) CHARACTER SET utf8 DEFAULT NULL,
                              `parent` int(11) DEFAULT '0',
                              `uri` varchar(250) DEFAULT NULL,
                              `icon` char(50) DEFAULT NULL,
                              `backend` tinyint(1) DEFAULT '0',
                              `status` tinyint(4) DEFAULT '1',
                              `hidden` tinyint(1) NOT NULL DEFAULT '0',
                              `order` int(3) DEFAULT '0',
                              PRIMARY KEY (`id`)
                            ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;");
        }
    }
}