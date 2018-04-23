<?php if ( ! defined('BASEPATH')) exit('No direct script core allowed');

class Gallery_Model extends CI_Model
{
    var $table = 'blog_gallery';
    var $testimonial_fields = array(
        'id' => array(
            'type' => 'hidden'
        ),

        'image' => array(
            'value'=>null
        ),
        'category' => array(
            'type' => 'select',
            'icon' => 'list'
        ),
        'status' => array(
            'type' => 'publish',
            'value'=>1
        ),
        'content' => array(
            'type' => 'textarea',
            'editor' => 'form-control'
        ),
    );
    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    function fields()
    {
        $fields = $this->testimonial_fields;
        $fields["category"]['options'] = $this->Category_Model->load_options("gallery");
        return $fields;
    }

    function get_item_by_id($id = 0)
    {
        return $this->db->where('id', $id)->get($this->table)->row();
    }

    function getAll(){
        $this->db->where('t.status', 1)->from($this->table." AS t")->select("t.image, t.summary");
        $this->db->join("category AS c",'c.id=t.category','LEFT')->select("c.alias");
        return $this->db->get()->result_array();
    }

    function update($data=NULL){
        if( !isset($data['id']) || strlen($data['id']) < 1 ){
            $data['id'] = 0;
        }
        if( !isset($data['ordering']) || strlen($data['ordering']) < 1 ){
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
        $this->db->select('m.*')->where("m.status <>",-1);
        $this->db->join("category AS c",'c.id = m.category','LEFT')->select("c.name AS category_name");
        $this->db->order_by('m.id ASC');
        $query = $this->db->get($this->table." AS m");
        $items = array();
        foreach ($query->result() AS $ite){

            $ite->actions = "";
            $ite->content = word_limiter($ite->content,20);
            $items[] = $ite;
        }
        return jsonData(array('data'=>$items));
    }

    public function item_delete($id=0){
        $this->db->where('id',$id)->update($this->table,['status'=>-1]);
    }
}