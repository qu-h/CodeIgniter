<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');

class DBConfig_Model extends CI_Model
{
    var $table = 'config';
    var $config_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'name' => array(
            'label' => 'Config Name',
            'desc' => null,
            'icon' => 'send',
        ),

        'value' => ['type' => 'text'],
        "status" => ['value' => 1,'type'=>'hidden']

    );

    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function fields()
    {
        return $this->config_fields;
    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }

    function update($data=NULL){

        if( !isset($data['id']) || $data['id'] =="" ){
            $data['id'] = 0;
        }
        if( !isset($data['status']) || $data['status'] =="" ){
            $data['status'] = 1;
        }


        if( $this->check_exist($data['name'],$data['id']) ){
            set_error('Config name');
            return false;
        } elseif( intval($data['id']) > 0 ) {
            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->table,$data);

        } else {
            $this->db->insert($this->table,$data);
            $id = $this->db->insert_id();
        }

        return $id;
    }

    function check_exist($alias,$id){
        if( !is_numeric($id) ){
            $id = 0;
        }
        $this->db->where('name',$alias)
            ->where('id <>',$id);
        $result = $this->db->get($this->table);
        if( !$result ){
            bug($this->db->last_query());die('query error');
        }
        return ( $result->num_rows() > 0) ? true : false;
    }
}