<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');

class Testimonial_Model extends CI_Model
{
    var $table = 'blog_testimonial';
    var $testimonial_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),

        'fullname' => array(
            'label' => 'Customer Name',
            'desc' => null,
            'icon' => 'send'
        ),


        'status' => array(
            'type' => 'publish',
            'value'=>1
        ),

        'content' => array(
            'type' => 'textarea',
            'editor' => 'form-control'
        ),
    );
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function fields()
    {
        $fields = $this->testimonial_fields;
        return $fields;
    }

    function get_item_by_id($id = 0)
    {
        return $this->db->where('id', $id)->get($this->table)->row();
    }

    function getAll(){
        $this->db->where('t.status', 1)->from($this->table." AS t")->select("t.*");
        return $this->db->get()->result();
    }

    function update($data=NULL){
        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }

        $data['status'] = $data['status']=='on' ? true:false;
        if( intval($data['id']) > 0 ) {
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

    function items_json(){
        $this->db->select('m.*');

        $this->db->where("m.status <>",-1);
        $this->db->order_by('m.id ASC');
        $query = $this->db->get($this->table." AS m");
        $items = array();
        foreach ($query->result() AS $ite){

            $ite->actions = "";
            $ite->content = word_limiter($ite->content,20);
            $items[] = $ite;
        }
        return jsonData(array('data'=>$items));
    }
}