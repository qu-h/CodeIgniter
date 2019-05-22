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
            'type' => 'multiselect',
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

        if( $this->isExist(['alias'=>$data['alias'],'group_id'=>$data['group_id']],$data['id']) ){
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
        }
        return $id;
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

        if( $status ){
            $this->db->where('k.status',$status);
        }

        $this->db->order_by("k.word ASC");
        $query = $this->db->get($this->table." AS k");

        if( $query->num_rows() > 0 ){ foreach ($query->result() as $row) {
            $subOptions = $this->load_options($status,$using_id,$level-1,$row->id);
            if( $level > 1 && !empty($subOptions) ){
                $options[$row->word] = $subOptions;
            } else {
                $options[$row->id] = $row->word;
            }
        }}
        return $options;

    }
}