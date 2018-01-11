<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');

class SlideShow_Model extends CI_Model
{
    var $table = 'slideshow';
    var $slider_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'image' => array(
            'type' => 'file',
            "value"=>null
        ),
        'title' => array(
            'label' => 'Slider Title',
            'desc' => null,
            'icon' => 'send'
        ),
        'link' => array(
            'label' => 'Slider link',
            'desc' => null,
            'icon' => 'link'
        ),

        'summary'=>array(
            'type' => 'textarea',
            'editor'=>'form-control',
        ),

    );
    function __construct(){
        parent::__construct();
        $this->load->database();
    }
    function fields()
    {
        return $this->slider_fields;
    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }

    function update($data=NULL){

        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }

        if( $this->check_exist($data['image'],$data['id']) ){
            set_error('Dupplicate Slider');
            return false;
        } elseif( intval($data['id']) > 0 ) {
            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->table,$data);
            return $id;
        } else {
            $this->db->insert($this->table,$data);
            return $this->db->insert_id();
        }
    }

    function check_exist($image,$id){

        if( !is_numeric($id) ){
            $id = 0;
        }
        $this->db->where('image',$image)->where('id <>',$id);
        $result = $this->db->get($this->table);

        return ( $result->num_rows() > 0) ? true : false;
    }
}