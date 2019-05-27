<?php if (!defined('BASEPATH')) exit('No direct script coess allowed');

class SystemTagModel extends MX_Model
{
    var $table = 'keywords';
    var $keyword_fields = array(
        'id' => array(
            'type' => 'hidden',
            'value'=>0
        ),

        'word' => array(
            'label' => 'keyword',
            'desc' => null,
            'icon' => 'send'
        ),
        'alias' => array(
            'label' => 'Keyword Alias',
            'desc' => null,
            'icon' => 'link'
        ),
        'group_id' => array(
            'type' => 'select_category_tag',
            'icon' => 'list',
            'value' => 0
        ),
        'rate' => ['type' => 'stars','value'=>1],

        'status' => array(
            'type' => 'publish',
            'value' => 1
        ),
        //'ordering' => ['type' => 'number', 'icon' => 'sort-numeric-desc']
    );

    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function fields()
    {
        $fields = $this->keyword_fields;
        $fields['group_id']['options'] = $this->load_options(1,[],1);
        return $fields;
    }

    public function get_row(){
        $row = parent::get_row();
        if( $row ){
            $row->group_id = [];
            $categories = $query = $this->db->where('children',$row->id)->get("keywords_category");
            if( $categories->num_rows() > 0 ) foreach ($categories->result() AS $cate){
                $row->group_id [] = $cate->parent;
            }
        }

        return $row;
    }

    function items_json($group_id = 0)
    {
        $this->db->select("w.id, w.word, w.status, w.rate, '' AS actions")->from($this->table . " AS w");
        if ($group_id !== null) {
            $this->db->where("w.group_id", $group_id);
        }
        $this->db->where("(w.status <> -1 OR w.status IS NULL)");

        if ($this->search) {
            $this->db->like('LOWER(w.word)', strtolower($this->search));
        }

        return $this->dataTableJson();
    }

    function update($data){
        if( !isset($data['alias']) OR  strlen($data['alias']) < 1 ){
            if( strlen($data['word']) > 0 ){
                $data['alias'] = url_title($data['word'],'-',TRUE);
            } else {
                set_error('Please enter alias');
                return false;
            }
        }

        if( !isset($data['status']) ){
            $data['status'] = 0;
        }

        $categories = [];
        if( array_key_exists('group_id',$data) ){
            $categories = $data['group_id'];
            unset($data['group_id']);
        }


        if( $this->isExist($data['alias'],$data['id'],$categories) ){
            set_error('Duplicate Alias');
            return false;
        } elseif( intval($data['id']) > 0 ) {
            $data['modified_date'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->table,$data);
        } else {
            $this->db->insert($this->table,$data);
            $id = $this->db->insert_id();
        }

        if( !$id ){
            bug($this->db->last_query());
        } else {
            $this->update_category($id,$categories);
        }
        return $id;
    }

    function isExist($alias, $id = 0,$groupIds=[])
    {
        if (!is_numeric($id)) {
            $id = 0;
        }
        $this->db->from('keywords AS t')->where(['t.alias'=>$alias])->where('t.id <>', $id)->select('t.*');
        $this->db->join('keywords_category AS c','c.children=t.id','INNER')->select('c.id AS link_id');

        $result = $this->db->get();

        if (!$result) {
            bug($this->db->last_query());
            die;
        }

        return $result->num_rows() > 0;
    }

    private function update_category($id,$categories=[]){
        $query = $this->db->where('children',$id)->get("keywords_category");
        if( $query->num_rows() < 1 && !empty($categories) ) foreach ($categories AS $cate){
            $data = ['children'=>$id,'parent'=>$cate];
            $this->db->insert("keywords_category",$data);
        } else {
            foreach ($query->result() AS $row){
                if( in_array($row->parent,$categories) != true ){
                    $this->db->where('id', $row->id)->delete('keywords_category');
                } else if (($key = array_search($row->parent, $categories)) !== false) {
                    unset($categories[$key]);
                }
            }
            if( !empty($categories) ){
                foreach ($categories AS $cate){
                    $data = ['children'=>$id,'parent'=>$cate];
                    $this->db->insert("keywords_category",$data);
                }
            }
        }
    }

    public function load_options($status=1,$using_id=[],$level=1,$parent_id=0)
    {
        $options = array();
        if( $level < 1 )
            return [];
        if( is_numeric($level) && $level > 0  ){
            $this->db->where('k.group_id',$parent_id);
        }
        if( is_numeric($using_id) ){
            $using_id = [$using_id];
        }
        if( !empty($using_id) ){
            $this->db->where_not_in('k.id',$using_id);
        }

        if( $status !== null ){
            $this->db->where('k.status',$status);
        }

        $this->db->order_by("k.word ASC");
        $query = $this->db->get($this->table." AS k");

        if( $query->num_rows() > 0 ){ foreach ($query->result() as $row) {
            $subOptions = $this->load_options($status,$using_id,$level-1,$row->id);
            if( $level > 1 && !empty($subOptions) ){
                //$options[$row->word] = $subOptions;
                $options[$row->id] = ['id'=>$row->id,'label'=>$row->word,'children'=>$subOptions];
            } else {
                //$options[$row->id] = $row->word;
                $options[$row->id] = ['id'=>$row->id,'label'=>$row->word];
            }
        }}
        return $options;

    }
}