<?php

class MX_Model extends CI_Model
{
    public $limit = 50, $page = 1;
    public $table=NULL;
    var $search, $orders = '';
    var $tableFields = [];
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

        $search = input_get('search');
        if( $search ){
            $this->search = $search['value'];
        }

        $columns = input_get('columns');
        if( is_array($columns) && !empty($columns) ){
            foreach ($columns AS $f){
                $this->tableFields[] = $f['data'];
            }

            $order = input_get('order');

            if( $order ){
                foreach ($order AS $o){
                    $this->orders[] = [$this->tableFields[$o['column']],$o['dir']];
                }
            }

        }
    }

    function row_get($id=0,$table=null){
        if( strlen($table) < 0 ){
            $table = $this->table;
        }

        $row = $this->db->where("id",$id)->limit(1)->get($table)->row();
        return $row;
    }

    function dataTableJson($db=null){
        if( is_null($db) ){
            $db = $this->db;
        }
        $tempdb = clone $db;
        $num_rows = $tempdb->count_all_results();
        $query = $db->limit($this->limit,$this->offset)->get();
        $data = $query->result_array();
        return jsonData(array('data'=>$data,'draw'=>$this->draw,'recordsTotal'=>$num_rows,'recordsFiltered'=>$num_rows ));
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