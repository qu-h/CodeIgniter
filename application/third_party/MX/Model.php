<?php

class MX_Model extends CI_Model
{
    public $limit = 50, $page = 1;
    public $table = NULL;
    var $search, $orders = [];
    var $tableFields = [];
    public function __construct()
    {
        parent::__construct();
        $ci = get_instance();
        $this->load->database();
        $this->draw = input_get('draw');
        if( $ci->uri->extension =='json' ){
            $length = input_get('length');
            $ci->session->set_userdata('page_length',$length);
            $start = input_get('start');
            $ci->session->set_userdata('page_start',$start);
            $order = input_get('order');
            $ci->session->set_userdata('page_order',$order);
        }
        $this->limit = $ci->session->userdata('page_length');
        $this->offset = $ci->session->userdata('page_start');


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

        $row = $this->db->from($table)->where("id",$id)->limit(1)->get()->row();
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
//bug($db->last_query(),'bug query');
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

    function checkTableExist($tableName,$file=null,$module=null){
        if (!$this->db->table_exists($tableName)) {
            list($path,$file) = Modules::find($file,$module,null,true);
            if( $path ){
                if( !function_exists('read_file') ){
                    get_instance()->load->helper('file');
                }
                $data = read_file($path.$file);
                $sqls = preg_split('/;/', $data);
                if( count($sqls) > 0 ) foreach ($sqls AS $sql){
                    $sql = trim($sql);
                    if( strlen($sql) > 0 ){
                        $this->db->query($sql);
                    }

                }
            }
        }


    }
}