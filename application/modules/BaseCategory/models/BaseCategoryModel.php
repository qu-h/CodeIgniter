<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');

/**
 * Class BaseCategoryModel
 * @property BaseCategoryMapModel $BaseCategoryMapModel
 */
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
            'icon' => 'fa-tasks',
            'value'=>0,
            'multiple'=>true
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
//        $this->checkTableExist($this->table,'sql/create-category.sql','backend');
        if( !class_exists('BaseCategoryMapModel')){
            $this->load->model("BaseCategory/BaseCategoryMapModel");
        }
    }

    function fields()
    {
        $fields = $this->category_fields;
        return $fields;
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
        $row = $this->db->where('id',$id)->get($this->table)->row();
        if( $this->category_fields['parent']['multiple'] && $row->id > 0 ){
            $row->parent = $this->BaseCategoryMapModel->getCategories($row->id,$this->table);
        }
        return $row;
    }

    function update($data=NULL,$validation=true){
        $parents = [];
        if( $validation ){
            if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
                if( strlen($data['name']) > 0 ){
                    $data['alias'] = url_title($data['name'],'-',true);
                } else {
                    set_error('Please enter alias');
                    return false;
                }
            }
//            if( is_null($data['parent']) || strlen($data['parent']) < 1){
//                $data['parent'] = reset($data['parent']);
//            }
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


        if( $validation && $this->check_exist($data['alias'],$data['id']) ){
            set_error('Dupplicate Category');
            return false;
        }

        $id = 0;
        if( intval($data['id']) > 0 ) {
            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->table,$data);
        } elseif ($validation) {
            $this->db->insert($this->table,$data);
            $id = $this->db->insert_id();
        }

        if( !empty($parents)){
            $this->BaseCategoryMapModel->update($id,$this->table,$parents);
        }

        return $id;
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
//            ->where("parent = $parent")
            ->where("type",$this->table)
            ->where('id <>',$id);

        $result = $this->db->get($this->table);

        return ( $result->num_rows() > 0) ? true : false;
    }

    public function load_options($type='article',$status=1,$using_id=[],$level=1,$parent_id=0,$whereIds=[])
    {
        $options = [];

        if( $level == 0 )
            return [];

//        if( is_numeric($level) && $level !== 0 && $parent_id > -1 ){
//            $this->db->where('c.parent',$parent_id);
//        }
        if( is_numeric($using_id) ){
            $using_id = [$using_id];
        }
        if( !empty($using_id) ){
            /**
             * remove to show all item in select box
             */
//            $this->db->where_not_in('c.id',$using_id);
        }

        $this->db->where("c.type",$type);
        if(!empty($whereIds)){
            $this->db->where_in('c.id',$whereIds);
        }

        if( $status !== null && $status !== '*' ){
            $this->db->where('c.status',$status);
        }
        $this->db->order_by("c.ordering ASC");
        $query = $this->db->get($this->table." AS c");

        if( $query->num_rows() > 0 ){ foreach ($query->result() as $row) {

//            $subOptions = $this->load_options($type,$status,$using_id,$level-1,$row->id);
            $option = ['id'=>$row->id,'label'=>$row->name];
            if(  $level !== 0 ){
                $parents = $this->BaseCategoryMapModel->getChildrens($row->id,$this->table);
                if( !empty($parents)){
                    $subOptions = $this->load_options($type,$status,$using_id,$level-1,-1,$parents);
                    if(  !empty($subOptions) ){
                        $option['children'] = $subOptions;
                    }
                }
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

    public function items_tree($type='article',$parent_id=0,$level=1,$where=[],$using_id=[],$whereIds=[]){
        $items = [];
        if( $level == 0 )
            return [];

        if( is_numeric($level) && $level > 0 && $parent_id > -1 ){
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
        if(!empty($whereIds)){
            $this->db->where_in('id',$whereIds);
        }

        $this->db->select("id, name, status, ordering, type");
        $this->db->order_by("c.ordering ASC");
        $query = $this->db->get($this->table." AS c");

        if( $query->num_rows() > 0 ){ foreach ($query->result_array() as $row) {
            if( $level > 1 ){
                $parents = $this->BaseCategoryMapModel->getChildrens($row['id'],$this->table);
                if( !empty($parents)){
                    $row['children'] = $this->items_tree($type,-1,$level-1,$where,$using_id,$parents);
                }
            }
            $items[] = $row;
        }}
        return $items;
    }

    public function items_tree_with_logo($type='article',$level=0,$whereIds=[],$using_id=[]){
        $items = [];
        if( $level == 0 )
            return [];

        if( is_numeric($using_id) ){
            $using_id = [$using_id];
        }
        if( !empty($using_id) ){
            $this->db->where_not_in('id',$using_id);
        }

        $this->db->where(array("type"=>$type));

        if(!empty($whereIds)){
            $this->db->where_in('id',$whereIds);
        } else {
            $this->db->where('c.parent < ',1);
        }

        $this->db->select("id, name, status, ordering, type, summary");
        $this->db->order_by("c.ordering ASC");
        $query = $this->db->get($this->table." AS c");

        if( $query->num_rows() > 0 ){ foreach ($query->result_array() as $row) {

            $summary = trim($row['summary']);
            if ( strlen($summary) > 0 ){
                $markdown = new CI_MarkdownRead($summary);

                $logo = $markdown->get_reference('logo');
                $row['logo'] = null;
                if( $logo ){
                    $row['logo'] = env('ASSETS_GIT_PATH')."app-logo/$logo";
                }
            }

            if( $level > 1 ){
                $parents = $this->BaseCategoryMapModel->getChildrens($row['id'],$this->table);
                if( !empty($parents)){
                    $row['children'] = $this->items_tree_with_logo($type,$level-1,$parents,$using_id);
                }
            }
            $items[] = $row;
        }}
        return $items;
    }
}