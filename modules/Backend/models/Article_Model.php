<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');

class Article_Model extends CI_Model {
	var $table = 'article';
	var $page_limit = 10;
	function __construct(){
		parent::__construct();
		$this->load->database();
	}

	function get_item_by_id($id=0){
	    return $this->db->where('id',$id)->get($this->table)->row();
	}

	function update($data=NULL){
	    if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
	        if( strlen($data['title']) > 0 ){
	            $data['alias'] = url_title($data['title'],'-',true);
	        } else {
	            set_error('Please enter alias');
	            return false;
	        }

	    }

	    if( !isset($data['id']) ){
	        $data['id'] = 0;
	    }
	    if( is_null($data['category']) ){
	        $data['category'] = 0;
	    }
	    if( $this->check_exist($data['alias'],$data['id'],$data['category']) ){
	        set_error('Dupplicate Article');
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
        //bug($this->db->last_query());die;
	    return ( $result->num_rows() > 0) ? true : false;
	}

	/*
	 * Json return for Datatable
	 */
	function items_json($actions_allow=NULL){
	    $this->db->select('id,title,category,source');
	    $this->db->order_by('id ASC');
	    $query = $this->db->get($this->table);
        $items = array();
        foreach ($query->result() AS $ite){
            if( strlen($ite->source ) > 0 ){
                $parse = parse_url($ite->source );
                if( isset($parse['host']) ){
                	$ite->source = $parse['host'];
                }
                
            }
            $ite->actions = "";
//             if( strlen($actions_allow) > 0 ) foreach (explode(',',$actions_allow) AS $act){
//                 $ite->actions .= '<button class="btn btn-xs btn-default" ><i class="fa fa-pencil"></i></button>';
//             }
            $items[] = $ite;
        }
	    return jsonData(array('data'=>$items));
	}

	function get_items_latest(){
		$this->db->select('id,title,summary ,category,source');
	    $this->db->order_by('id DESC');
	    $query = $this->db->limit($this->page_limit)->get($this->table);
	    return $query->result();
	}
}