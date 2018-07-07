<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');
class CrawlerMask_Model extends MX_Model
{
    var $mask_fields = array(
        'id' => array( 'type' => 'hidden' ),
        'domain'=>[],
        'thumbnail_element' => array('type' => 'textarea','editor'=>'editor-full'),
        'title_element' => array('type' => 'textarea','editor'=>'editor-full'),
        'content_element' => array('type' => 'textarea','editor'=>'editor-full'),
    );
    var $table = 'crawler_mask';
    function __construct()
    {
        parent::__construct();
        $this->load->database();
        $this->createTable();
    }

    function get_item_by_id($id){
        return parent::row_get($id,$this->table);
    }

    public function get_site($domain){
        $data = $this->db->where('domain',$domain)->get($this->table);
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

    function items_json($actions_allow=NULL){
        $this->db->from($this->table)->select('*');
        $this->db->select("0 AS article_count",true);
        if( $this->search ){
            $this->db->like('domain',$this->search);
        }

        if( $this->orders ){
            foreach ($this->orders AS $o){
                $this->db->order_by($o[0],$o[1]);
            }
        } else {
            $this->db->order_by('id DESC');
        }
        return $this->dataTableJson();
    }

    function update($data=NULL){

        if( !isset($data['id']) || $data['id'] =="" ){
            $data['id'] = 0;
        }

        if( $this->check_exist($data['domain'],$data['id']) ){
            set_error('Dupplicate Idol');
            return false;
        } elseif( intval($data['id']) > 0 ) {
            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->table,$data);
            return $id;
        } else {
            $data['created'] = date("Y-m-d H:i:s");
            $this->db->insert($this->table,$data);
            return $this->db->insert_id();
        }
    }

    function check_exist($domain,$id){
        if( !is_numeric($id) ){
            $id = 0;
        }
        $this->db->where('domain',$domain)
            ->where('id <>',$id);
        $result = $this->db->get($this->table);
        if( !$result ){
            bug($this->db->last_query());die('query error');
        }
        return ( $result->num_rows() > 0) ? true : false;
    }

}