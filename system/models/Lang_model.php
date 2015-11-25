<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Lang_Model extends CI_Model {
    var $table = 'content';
	function __construct(){
		parent::__construct();
		$this->load->database();
	}
	
	function text($id){
	    $vn = $this->db->where(array('id'=>$id,'language'=>'vn'))->from($this->table)->get()->row();
	    $data = array();
	    if( isset($vn->table) && $vn->table==$this->table ){
	        
	        $data['id'] = $vn->id;
	        $data[$vn->language] = $vn->content;
	        $en = $this->db->where(array('taget'=>$id,'language'=>'en'))->from($this->table)->get()->row();
	        if( isset($en->content) && $en->content ){
	            $data[$en->language] = $en->content;
	        }
	        
	    }
	    
	    return $data;
	}

	public function line($returnSQL=false,$table,$field,$taget,$lang='vn',$return=null){

	    $this->db->select('txt.content')->from('content AS txt');
	    $this->db->where(array('txt.table'=>$table,'txt.field'=>$field));
	    if( is_numeric($taget) ){
	        $this->db->where('txt.taget',$taget);
	    }


	    if( $returnSQL ){
	        $sql = $this->db->get_compiled_select();

	        $return = ( $return ) ? $return : $field;
	        return "($sql AND `txt`.`taget`=$taget LIMIT 1) AS $return";
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


	function get_row($taget=0,$field='title',$table=null){
	    $this->db->where(array('table'=>$table,'field'=>$field));
	    if( $taget ){
	        $this->db->where('taget',$taget);
	    }
	    $item = $this->db->get($this->table)->row();
	    return $item;
	    
	}
	function search($table,$field,$txt='',$where=array(),$return_taget_id=false){
	    $this->db->where(array('table'=>$table,'field'=>$field));
	    $this->db->where('content',$txt);
	    if( $where ){
	        $this->db->where($where);
	    }
        $items = $this->db->get('content')->result();
        if( $return_taget_id ){
            $ids = array();
            bug($items);
            foreach ($items AS $it){
                $ids[] = $it->taget;
            }
            return $ids;
        }
        return $items;

	}

	function line_by_id($id){
	    return $this->db->where('id',$id)->get('content')->row();
	}

}