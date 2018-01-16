<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');

class Menu_Model extends CI_Model
{
    var $table = 'menus';
    var $article_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'backend' => array(
            'type' => 'hidden',
            'value'=>0
        ),
        'name' => array(
            'icon' => 'send'
        ),
        'uri' => array(
            'label' => 'menu Alias',
            'desc' => null,
            'icon' => 'link'
        ),
        'parent' => array(
            'type' => 'select',
            'icon' => 'list'
        ),
//        'summary'=>array(
//            'type' => 'textarea',
//            'editor'=>'form-control'
//        ),
//        'content' => array(
//            'type' => 'textarea'
//        ),

        'status' => array(
            'type' => 'publish',
            'value'=>1
        ),
        'order'=>['type'=>'number','icon'=>'sort-numeric-desc']
    );

    function fields()
    {
        return $this->article_fields;
    }

    function get_item_by_id($id=0){
        return $this->db->where('id',$id)->get($this->table)->row();
    }

    function items_json($backend = 0, $actions_allow=NULL){
        $this->db->select('m.*');
        if( $backend !== null ){
            $this->db->where("m.backend",$backend);
        }
        $this->db->where("m.status <>",-1);
        $this->db->order_by('m.id ASC');
        $query = $this->db->get($this->table." AS m");
        $items = array();
        foreach ($query->result() AS $ite){
            $ite->actions = "";

            $items[] = $ite;
        }
        return jsonData(array('data'=>$items));
    }

    function update($data=NULL){
        if( !isset($data['uri']) OR  strlen($data['uri']) < 1 ){
            if( strlen($data['name']) > 0 ){
                $data['uri'] = url_title($data['name'],'-',true);
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
        if( is_null($data['order']) || strlen($data['order']) < 1){
            $data['order'] = 0;
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

    public function getAll($return_array=true,$limit=10,$backend=false,$parent=0){
        $this->db->from($this->table." AS m")->select("m.name, m.uri");
        $this->db->where([
            'parent'=>$parent,
            'status'=>1,
            'backend'=>$backend
        ]);
        $this->db->order_by("m.order ASC");
        if( $limit > 0 ){
            $this->db->limit($limit);
        }
        $query = $this->db->get();
        return $return_array ? $query->result_array() : $query->result();
    }

}