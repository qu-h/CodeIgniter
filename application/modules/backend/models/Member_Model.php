<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');
class Member_Model extends CI_Model
{
    var $table = 'member';
    var $positionTable = "member_position";
    var $member_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'image' => array(
            'type' => 'file',
            "value" => null
        ),
        'name' => array(
            'label' => 'Member Fullname',
            'desc' => null,
            'icon' => 'send'
        ),

        'summary' => array(
            'type' => 'textarea',
            'editor' => 'form-control'
        ),
        'position' => array(
            'type' => 'select',
            'options'=>[]

        ),
        'linkedin'=>['icon'=>'linkedin'],
        'facebook'=>['icon'=>'facebook'],
        'twitter'=>['icon'=>'twitter'],
        'youtube'=>['icon'=>'youtube'],
        'status' => array(
            'type' => 'publish'
        ),
        'ordering' => ['type' => 'number','icon'=>'sort-numeric-desc']
    );

    var $position_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),

        'title' => array(
            'label' => 'Position Title',
            'desc' => null,
            'icon' => 'send'
        ),


        'status' => array(
            'type' => 'publish',
            'value'=>1
        ),
        'ordering' => ['type' => 'number','icon'=>'sort-numeric-desc'],
        'summary' => array(
            'type' => 'textarea',
            'editor' => 'form-control'
        ),
    );

    var $page_limit = 10;

    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function fields()
    {
        $fields = $this->member_fields;
        $fields['position']['options'] = $this->positionItemsSelect();
        return $fields;
    }

    function get_item_by_id($id = 0)
    {
        return $this->db->where('id', $id)->get($this->table)->row();
    }

    function getAll(){
        $this->db->where('m.status', 1)->from($this->table." AS m")->select("m.*");
        $this->db->join($this->positionTable .' AS p','p.id = m.position',"LEFT")
            ->select("p.title AS positionTitle");
        $this->db->order_by("m.ordering");
        return $this->db->get()->result();
    }

    function update($data=NULL){
        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }
        if( is_null($data['ordering']) || strlen($data['ordering']) < 1){
            $data['ordering'] = 0;
        }

        $data['status'] = $data['status']=='on' ? true:false;
        if( intval($data['id']) > 0 ) {
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

    function items_json(){
        $this->db->select('m.*');
        $this->db->join($this->positionTable .' AS p','p.id = m.position',"LEFT")
        ->select("p.title AS positionTitle");

        $this->db->where("m.status <>",-1);
        $this->db->order_by('m.id ASC');
        $query = $this->db->get($this->table." AS m");
        $items = array();
        foreach ($query->result() AS $ite){

            $ite->actions = "";
            $ite->summary = word_limiter($ite->summary,20);
            $items[] = $ite;
        }
        return jsonData(array('data'=>$items));
    }

    /*
     * Postion of Member
     */

    function positionFields()
    {
        return $this->position_fields;
    }
    function getPositionById($id = 0)
    {
        return $this->db->where('id', $id)->get($this->positionTable)->row();
    }

    function positionItemsSelect(){
        $this->db->where('status', 1);
        $items = $this->db
                ->order_by("ordering")
                ->get($this->positionTable)->result();
        $options = [];
        if( $items ){
            foreach ($items As $i){
                $options[$i->id] = $i->title;
            }
        }
        return $options;
    }

    function positionUpdate($data=NULL){
        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }
        if( is_null($data['ordering']) || strlen($data['ordering']) < 1){
            $data['ordering'] = 0;
        }

        $data['status'] = $data['status']=='on' ? true:false;
        if( intval($data['id']) > 0 ) {
            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id',$id)->update($this->positionTable,$data);
            return $id;
        } else {
            $this->db->insert($this->positionTable,$data);
            return $this->db->insert_id();
        }
    }
    function positions_json(){
        $this->db->select('*');

        $this->db->where("status <>",-1);
        $this->db->order_by('id ASC');
        $query = $this->db->get($this->positionTable);
        $items = array();
        foreach ($query->result() AS $ite){

            $ite->actions = "";
            $ite->summary = word_limiter($ite->summary,20);
            $items[] = $ite;
        }
        return jsonData(array('data'=>$items));
    }
}