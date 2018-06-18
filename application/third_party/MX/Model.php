<?php

class MX_Model extends CI_Model
{
    public $limit = 50, $page = 1;
    public $table=NULL;
    public function __construct()
    {
        parent::__construct();
        $this->load->database();

        $this->draw = input_get('draw');
        $this->limit = input_get('length');
        $this->offset = input_get('start');
        if( $this->offset > 0 ){
            $this->limit += $this->offset;
        }
    }

    function row_get($id=0,$table=null){
        if( strlen($table) < 0 ){
            $table = $this->table;
        }

        $row = $this->db->where("id",$id)->limit(1)->get($table)->row();
        return $row;
    }

    function dataTableJson($query){
        $tempdb = clone $query;
        $num_rows = $tempdb->count_all_results();

        $query = $query->limit($this->limit,$this->offset)->get();
//        $items = array();
//        foreach ($query->result() AS $ite){
//            $ite->actions = "";
//            $items[] = $ite;
//        }

        return jsonData(array('data'=>$query->result_array(),'draw'=>$this->draw,'recordsTotal'=>$num_rows,'recordsFiltered'=>$num_rows ));
    }

    function get($where=NULL){
        if( is_array($where) ){

        } else if( is_numeric($where) ) {
            $this->db->where('id',$where);
        }
        return $this->db->get($this->table)->row();
    }

    function isExist($where,$id=0){
        if( !is_numeric($id) ){
            $id = 0;
        }
        $this->db->where($where)->where('id <>',$id);
        $result = $this->db->get($this->table);
        if( !$result ){
            bug($this->db->last_query());die;
        }

        return $result->num_rows() > 0;
    }
}