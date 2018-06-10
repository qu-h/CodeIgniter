<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');
class Article_Model extends CI_Model {
    var $table = 'article';
    var $article_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'imgthumb' => array(
            'type' => 'file',
            "value"=>null
        ),
        'title' => array(
            'label' => 'Category Name',
            'desc' => null,
            'icon' => 'send'
        ),
        'alias' => array(
            'label' => 'Category Alias',
            'desc' => null,
            'icon' => 'link'
        ),
        'category' => array(
            'type' => 'select',
            'icon' => 'list'
        ),
        'source' => array(
            'type' => 'crawler_link',
            'icon' => 'link'
        ),
        'summary'=>array(
            'type' => 'textarea',
            'editor'=>'form-control'
        ),
        'content' => array(
            'type' => 'textarea'
        ),
        'status' => array(
            'type' => 'publish',
            'value'=>1
        ),
        'ordering'=>['type'=>'number','icon'=>'sort-numeric-desc']
    );

    var $page_limit = 10;
    function __construct(){
        parent::__construct();
        $this->load->database();
    }

    function fields()
    {
        return $this->article_fields;
    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }
    function get_item_by_alias($alias=0,$cateogry_id=0,$status=1){
        $this->db->where("alias",$alias);
        $this->db->where("category",$cateogry_id);
        if( is_numeric($status) ){
            $this->db->where("status",$status);
        }

        $query = $this->db->get($this->table);
        bug($this->db->last_query());
        return $query->row_array();
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

        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }
        if( !isset($data['ordering']) || strlen($data['ordering']) < 1 ){
            $data['ordering'] = 0;
        }

        if( is_null($data['category']) || strlen($data['category']) < 1){
            $data['category'] = 0;
        }
        $data['status'] = $data['status']=='on' ? true:false;

        if( $this->check_exist($data['alias'],$data['id'],$data['category']) ){
            set_error('Dupplicate Article');
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
        if( !$id ){
            bug($this->db->last_query());
        }
        return $id;
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
        if( !$result ){
            bug($this->db->last_query());die;
        }

        return ( $result->num_rows() > 0) ? true : false;
    }

    /*
     * Json return for Datatable
     */
    function items_json($category_id = null, $actions_allow=NULL){
        $this->db->select('a.id,a.title,a.category,a.source, a.imgthumb, a.summary,a.status, a.ordering');
        if( $category_id !== null ){
            $this->db->where("a.category",$category_id);
        }
        $this->db->where("(a.status <> -1 OR a.status IS NULL)");
//	    $this->db->order_by('a.ordering DESC');
        $query = $this->db->get($this->table." AS a");
        $items = array();
        if( !$query ){
            bug($this->db->last_query());die("error");
        }
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

            $ite->summary = word_limiter($ite->summary,20);
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

    public function item_delete($id=0){
        $this->db->where('id',$id)->update($this->table,['status'=>-1]);
    }

    public function getAll($category_id=0,$return_array=false,$limit=10){
        $this->db->select("a.title, a.imgthumb, a.alias, a.summary");
        $this->db->select("a.category AS category_id");
        $this->db->where('a.status', 1)->from($this->table." AS a");
        $this->db->join("category AS c",'c.id = a.category','LEFT')
            ->select("c.alias AS category_alias");
        $this->db->where("a.category",$category_id);
        $this->db->order_by("a.ordering ASC");
        if( $limit > 0 ){
            $this->db->limit($limit);
        }
        $query = $this->db->get();
        return $return_array ? $query->result_array() : $query->result();
    }

}
