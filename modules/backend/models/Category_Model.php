<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');
class Category_Model extends CI_Model {
	var $ci;
	function __construct(){
		parent::__construct();
		$this->load->database();
	}
	var $table = 'category';

    function get_item_by_alias($alias="",$returnArray=false){
        $row = $this->db->where('alias',$alias)->get($this->table);
        return $returnArray ? $row->row_array() : $row->row();
    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }

    function update($data=NULL){
	    if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
	        set_error('Please enter alias');
	        return false;
	    }
        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }

        if( is_null($data['parent']) ){
            $data['parent'] = 0;
        }
	    if( $this->check_exist($data['alias'],$data['id'],$data['parent']) ) {
            set_error('Dupplicate Category');
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

	public function items_listview($parent = 0,$status = 1){
        $this->db
            ->from($this->table." AS c");
        if( $status || is_numeric($status) ){
            $this->db->where("c.status",$status);
        }
        $query = $this->db->get();
        $items = [];

        if( $query && $query->num_rows() > 0 ){
            $items = $query->result_array();
        } else {
            bug( $this->db->last_query() );die;
        }
        return $items;
    }
}