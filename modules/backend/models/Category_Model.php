<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');
class Category_Model extends CI_Model {
	var $ci;
	function __construct(){
		parent::__construct();
		$this->load->database();
	}
	var $table = 'category';

	function update($data=NULL){
	    if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
	        set_error('Please enter alias');
	        return false;
	    }
        if( is_null($data['parent']) ){
            $data['parent'] = 0;
        }
	    if( $this->check_exist($data['alias'],$data['id'],$data['parent']) ){
	        set_error('Dupplicate Category');
	        return false;
	    } else {
	        $this->db->insert($this->table,$data);
	        return $this->db->insert_id();
	    }


	}


	function check_exist($alias,$id,$parent=0){
	    if( !is_numeric($parent) ){
	        $parent = 0;
	    }
	    if( !is_numeric($id) ){
	        $id = 0;
	    }
        $this->db->where('alias',$alias)
                 ->where("parent = $parent")
                 ->where('id <>',$id);
        $result = $this->db->get($this->table);

        return ( $result->num_rows() > 0) ? true : false;
	}

	public function load_options($type='article',$status=1)
	{
		$options = array();
		$query = $this->db->where(array("c.type"=>$type,'c.status'=>$status))->get($this->table." AS c");
		if( $query->num_rows() > 0 ){ foreach ($query->result() as $row) {
			$options[$row->id] = $row->name;
		}}
		return $options;

	}
}