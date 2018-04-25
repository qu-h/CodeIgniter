<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');
class Product_Model extends CI_Model {
	var $ci;
	function __construct(){
		parent::__construct();
		$this->load->database();
	}
	var $table = 'product';

	function update($data=NULL){
	    if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
	        if( isset($data['name']) ){
	            $data['alias'] = url_title($data['name'],'-',true);
	        } else {
	            set_error('Please enter alias');
	            return false;
	        }
	    }

        if( is_null($data['category']) ){
            $data['category'] = 0;
        }
	    if( $this->check_exist($data['alias'],$data['id'],$data['category']) ){
	        set_error('Dupplicate Product');
	        return false;
	    } else {
            if( $data['id'] AND intval($data['id']) > 0 ){
                $id = $data['id']; unset($data['id']);
                $this->db->where('id',$id)->update($this->table,$data);
                set_error(lang('Success Update Product.'));
            } else {
                $this->db->insert($this->table,$data);
                $id = $this->db->insert_id();
                set_error(lang('Success Add New Product.'));
            }
//             bug($this->db->last_query()); die;
            return $id;

	    }
	}

	function check_exist($alias,$id,$category=0){
	    if( !is_numeric($category) ){
	        $category = 0;
	    }
	    if( !is_numeric($id) ){
	        $id = 0;
	    }
	    $this->db->where('alias',$alias)
	    ->where("category = $category")
	    ->where('id <>',$id);
	    $result = $this->db->get($this->table);

	    return ( $result->num_rows() > 0) ? true : false;
	}

	function item($id=0){
	    return $this->db->where('id',$id)->get($this->table)->row();
	}
}