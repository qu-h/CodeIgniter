<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');
class Category_Model extends CI_Model {

    var $table = 'category';

    var $category_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'type' => ['type' => 'hidden', 'value'=>'category'],
        'name' => array(
            'label' => 'Category Name',
            'desc' => null,
            'icon' => 'send'
        ),
        'alias' => array(
            'label' => 'Category Alias',
            'desc' => null,
            'icon' => 'link'
        ),
        'parent' => array(
            'type' => 'select',
            'icon' => 'list',
            'value'=>0
        ),
        'summary'=>array(
            'type' => 'textarea',
            'editor'=>'form-control'
        ),
        'description' => array(
            'type' => 'textarea'
        )
    );
	function __construct(){
		parent::__construct();
		$this->load->database();
	}


    function fields()
    {
        return $this->category_fields;
    }
    function get_item_by_alias($alias="",$returnArray=false){
        $row = $this->db->where('alias',$alias)->get($this->table);
        return $returnArray ? $row->row_array() : $row->row();
    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }

    function update($data=NULL){
	    if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
            if( strlen($data['name']) > 0 ){
                $data['alias'] = url_title($data['name'],'-',true);
            } else {
                set_error('Please enter alias');
                return false;
            }
	    }
        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }

        if( is_null($data['parent']) || strlen($data['parent']) < 1){
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

	public function items_listview($type="category",$parent = 0,$status = 1){
        $this->db
            ->from($this->table." AS c");
        if( $status || is_numeric($status) ){
            $this->db->where("c.status",$status);
        }
        if( strlen($type) > 0 ){
            $this->db->where("c.type",$type);
        }
        $query = $this->db->get();

        $items = [];

        if( $query ){
            $items = $query->result_array();
        } else {
            bug( $this->db->last_query() );die;
        }
        return $items;
    }
}