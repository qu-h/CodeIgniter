<?php

class MX_Model extends CI_Model
{
    public $limit = 50;
    public $table=NULL;
    public function __construct()
    {
        parent::__construct();
    }

    function row_get($id=0,$table=null){
        if( strlen($table) < 0 ){
            $table = $this->table;
        }

        $row = $this->db->where("id",$id)->limit(1)->get($table)->row();
        return $row;
    }
}