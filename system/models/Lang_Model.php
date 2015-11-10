<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Lang_Model extends CI_Model {
	function __construct(){
		parent::__construct();
		$this->load->database();
	}

	public function line($returnSQL=false,$table,$field,$taget,$lang='vn'){

	    $this->db->select('txt.content')->from('content AS txt');
	    $this->db->where(array('txt.table'=>$table,'txt.field'=>$field));
	    if( is_numeric($taget) ){
	        $this->db->where('txt.taget',$taget);
	    }


	    if( $returnSQL ){
	        $sql = $this->db->get_compiled_select();

	        return "($sql AND `txt`.`taget`=$taget LIMIT 1) AS $field";
	    } else {
	        $line = $this->db->get()->row();
	        return ($line && isset($line->content)) ? $line->content : null;
	    }
	}

	public function lines($table,$field,$taget){
	    $this->db->select('content, language')->from('content');
	    $this->db->where(array('table'=>$table,'field'=>$field));
	    if( is_numeric($taget) ){
	        $this->db->where('taget',$taget);
	    }
	    $lines = $this->db->get()->result();
	    $items = array();
	    if( $lines ) {

	        $langs_config = $this->config->item('languages');

	        foreach ($lines AS $l){
	            $items[$l->language] = $l->content;
	        }
	    }
	    return $items;
	}


	function search($table,$field,$txt='',$where=array()){
	    $this->db->where(array('table'=>$table,'field'=>$field));
	    $this->db->where('content',$txt);
	    if( $where ){

	        $this->db->where($where);
	    }
        $items = $this->db->get('content')->result();

        return $items;
	}

}