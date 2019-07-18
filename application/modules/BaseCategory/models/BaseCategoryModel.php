<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');

class BaseCategoryModel extends MX_Model {

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
            'type' => 'select_category',
            'category-type'=>"article",
            //'icon' => 'list',
            'value'=>0
        ),
        'summary'=>array(
            'type' => 'textarea',
            //'editor'=>'form-control',
            'editor'=>"row_input",
            "icon"=>"fa-comments"
        ),
        'description' => array(
            'type' => 'textarea'
        ),
        'status' => [ 'type' => 'publish', 'value' => 1 ],
        'ordering'=>['type'=>'number','icon'=>'sort-numeric-desc']
    );
    function __construct(){
        parent::__construct();
        $this->checkTableExist($this->table,'sql/create-category.sql','backend');
    }


    function fields()
    {
        return $this->category_fields;
    }

    function get_item_by_alias($alias="",$returnArray=false){
        $this->db->where('status',1);
        $this->db->where('alias',$alias);
        $row = $this->db->get($this->table);
        return $returnArray ? $row->row_array() : $row->row();
    }

    function get_items_by_type($type="",$returnArray=false){
        $this->db->where('type',$type);
        $this->db->where('status',1);
        $row = $this->db->get($this->table);
        return $returnArray ? $row->result_array() : $row->result();
    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }

    function update($data=NULL,$validation=true){
        if( $validation ){
            if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
                if( strlen($data['name']) > 0 ){
                    $data['alias'] = url_title($data['name'],'-',true);
                } else {
                    set_error('Please enter alias');
                    return false;
                }
            }

            if( is_null($data['parent']) || strlen($data['parent']) < 1){
                $data['parent'] = 0;
            }
            $data['status'] = ($data['status']=='on' || $data['status']) ? true: false;
        }

        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }

        if( !$validation && $data["id"] < 1 ){
            set_error('Invalid data');
            return false;
        }

        if( !isset($data['ordering']) || strlen($data['ordering']) < 1 ){
            $data['ordering'] = 1;
        }

        if( strlen($data['name']) > 0 ){
            $data['name'] = trim_title($data['name']);
        }

        if( $validation && $this->check_exist($data['alias'],$data['id'],$data['parent']) ){
            set_error('Dupplicate Category');
            return false;
        }

        if( intval($data['id']) > 0 ) {
            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->table,$data);
            return $id;
        } elseif ($validation) {
            $this->db->insert($this->table,$data);
            return $this->db->insert_id();
        }
    }

    public function item_delete($id=0){
        $this->db->where('id',$id)->update($this->table,['status'=>-1]);
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

    public function load_options($type='article',$status=1,$using_id=[],$level=1,$parent_id=0)
    {
        $options = [];
//        dd("debug level : $level",false,1);
        if( $level == 0 )
            return [];

        if( is_numeric($level) && ( $level !== 0 )  ){
            $this->db->where('c.parent',$parent_id);
        }
        if( is_numeric($using_id) ){
            $using_id = [$using_id];
        }
        if( !empty($using_id) ){
            $this->db->where_not_in('c.id',$using_id);
        }

        $this->db->where("c.type",$type);
        if( $status !== null && $status !== '*' ){
            $this->db->where('c.status',$status);
        }
        $this->db->order_by("c.ordering ASC");
        $query = $this->db->get($this->table." AS c");

        if( $query->num_rows() > 0 ){ foreach ($query->result() as $row) {
            $subOptions = $this->load_options($type,$status,$using_id,$level-1,$row->id);

            $option = ['id'=>$row->id,'label'=>$row->name];
            if(  $level !== 0 && !empty($subOptions) ){
                $option['children'] = $subOptions;
            }
            $options[$row->id] = $option;
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
            bug( $this->db->last_query() );die("error");
        }
        return $items;
    }

    public function items_tree($type='article',$parent_id=0,$level=1,$where=[],$using_id=[]){
        $items = [];
        if( $level < 1 )
            return [];

        if( is_numeric($level) && $level > 0  ){
            $this->db->where('c.parent',$parent_id);
        }
        if( is_numeric($using_id) ){
            $using_id = [$using_id];
        }
        if( !empty($using_id) ){
            $this->db->where_not_in('id',$using_id);
        }

        $this->db->where(array("type"=>$type));
        if( !empty($where) ){
            $this->db->where($where);
        }
        $this->db->select("id, name, status, ordering, type");
        $this->db->order_by("c.ordering ASC");
        $query = $this->db->get($this->table." AS c");

        if( $query->num_rows() > 0 ){ foreach ($query->result_array() as $row) {
            if( $level > 1 ){
                $row['children'] = $this->items_tree($type,$row['id'],$level-1,$where,$using_id);
            }
            $items[] = $row;
        }}
        return $items;
    }
}