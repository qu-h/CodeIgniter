<?php

/** * Class UpdateBackend
 * @property CI_DB_driver $db
 */

class UpdateBackend extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
    }

    public function index(){
        $this->create_category();
    }

    private function create_category(){
        if ( !$this->db->table_exists('category'))
        {
            $this->db->query("CREATE TABLE IF NOT EXISTS `category` (
                  `id` int(11) NOT NULL AUTO_INCREMENT,
                  `ordering` int(3) NOT NULL DEFAULT '0',
                  `type` char(50) COLLATE utf8_bin DEFAULT 'category',
                  `parent` int(11) DEFAULT '0',
                  `name` varchar(255) COLLATE utf8_bin NOT NULL,
                  `alias` varchar(255) COLLATE utf8_bin NOT NULL,
                  `summary` text COLLATE utf8_bin NOT NULL,
                  `description` text COLLATE utf8_bin NOT NULL,
                  `status` tinyint(1) NOT NULL DEFAULT '1',
                  `version` int(11) NOT NULL DEFAULT '0',
                  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  `modified` datetime DEFAULT NULL,
                  PRIMARY KEY (`id`),
                  KEY `id` (`id`)
                ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;");
        }

        if ( !$this->db->table_exists('category_map'))
        {
            $this->db->query("CREATE TABLE IF NOT EXISTS `category_map` (
                  `id` int(11) NOT NULL AUTO_INCREMENT,
                  `category_id` int(11) NOT NULL,
                  `target_table` varchar(100) NOT NULL,
                  `target_id` int(11) NOT NULL,
                  PRIMARY KEY (`id`)
                ) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;");
        }

        if ( !$this->db->field_exists('alias','category_map'))
        {
            $this->db->query("ALTER TABLE `category_map` ADD `alias` VARCHAR(100) NOT NULL AFTER `target_id`;");
        }






    }
}