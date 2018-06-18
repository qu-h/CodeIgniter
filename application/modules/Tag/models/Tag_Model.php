<?php if (!defined('BASEPATH')) exit('No direct script coess allowed');

class Tag_Model extends MX_Model
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
            'type' => 'select',
            'icon' => 'list',
            'value' => 0
        ),
        'rate' => ['type' => 'stars','value'=>0],

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
        return $this->keyword_fields;
    }

    function dataTableJson($group_id = 0)
    {
        $this->db->select("w.id, w.word, w.status, w.rate, '' AS actions")->from($this->table . " AS w");
        if ($group_id !== null) {
            $this->db->where("w.group_id", $group_id);
        }
        $this->db->where("(w.status <> -1 OR w.status IS NULL)");
        return parent::dataTableJson($this->db);
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

        if( $this->isExist(['alias'=>$data['alias'],'group_id'=>$data['group_id']],$data['id']) ){
            set_error('Dupplicate Article');
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
}