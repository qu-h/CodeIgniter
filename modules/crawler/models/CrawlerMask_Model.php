<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');
class CrawlerMask_Model extends CI_Model
{
    var $ci;

    function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->createTable();
    }

    var $table = 'crawler_mask';

    public function get_site($domain){
        $data = $this->db->where('domain',$domain)->get($this->table);
        // bug($data);
        // die("quannh");
        return $data->row();
    }

    private function createTable()
    {

        if (!$this->db->table_exists($this->table)) {
            $table = $this->table;
            $sql_create = "CREATE TABLE `$table` (
                 `id` int(11) NOT NULL,
                  `domain` varchar(250) DEFAULT NULL,
                  `title_element` varchar(100) DEFAULT NULL,
                  `content_element` varchar(100) DEFAULT NULL,
                  `thumbnail_element` varchar(100) DEFAULT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";

            $this->db->query($sql_create);

            $this->db->query("ALTER TABLE `$table` ADD PRIMARY KEY (`id`)");
            $this->db->query("ALTER TABLE `$table` MODIFY `id` int(8) NOT NULL AUTO_INCREMENT;");
        }
    }
}