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
}