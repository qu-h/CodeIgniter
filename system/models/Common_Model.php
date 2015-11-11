<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Common_Model extends CI_Model {
	var $ci = null;
	function __construct(){
		parent::__construct();
		$this->load->database();
		if( !method_exists ( $this , 'Lang_Model' ) ){
		    $this->load->model('Lang_Model');
		}
	}

	function update($id=0,$table='',$data=array(),$lang_fields=NULL){
	    if( isset($data['id']) ){
	        $id =  $data['id'];
	        unset($data['id']);
	    }

        if ( $this->db->field_exists('modified',$table) ) {
	        $data['modified'] = date('Y-m-d H:i:s');
	    }
	    if( $lang_fields && !empty($lang_fields) ){
	        foreach ($lang_fields AS $k){
	            $languages[$k] = $data[$k]; unset($data[$k]);
	        }
	    }

	    if( $id ){
	        $this->db->where('id', $id)->update($table, $data);
	    } else {
	        if ( $this->db->field_exists('created',$table) ) {
	            $data['created'] = date('Y-m-d H:i:s');
	        }
	        $this->db->insert($table, $data);
	        $id= $this->db->insert_id();
	    }

// 	    bug($this->db->last_query() );
// 	    die('quannh');

        if( $languages && !empty($languages) ) foreach ($languages AS $field=>$contents){
            if( !$id ) continue;
            $row = array('taget'=>$id,'table'=>$table,'field'=>$field);
            if( $contents && !empty($contents) ) foreach ($contents AS $lang => $txt){
                $txt = trim($txt);
                if( $field=='alias' && !$txt ){
                    if( isset($languages['name'][$lang]) ){
                        $txt = url_title($languages['name'][$lang]);
                    }
                }
                if( !$txt ) continue;
                $row['language'] = $lang;

                if( $content_id = $this->existed('content',$row) ){
                    $update_lang = $row;
                    $update_lang['content'] = $txt;
                    $this->db->where('id', $content_id)->update('content', $update_lang);
                } else {
                    $insert_lang = $row;
                    $insert_lang['content'] = $txt;
                    $this->db->insert('content', $insert_lang);
                }


            }
        }

	    return $id;
	}

	function alias_check($data,$name_field=null){
// 	    bug($data['alias']);
// 	    bug($data[$name_field]);
        if( isset($data['alias']) && isset($data[$name_field]) ){
            foreach ($data['alias'] AS $lang=>$txt){
                if( !$txt ){
                    $data['alias'][$lang] = url_title($data[$name_field][$lang]);
                }
            }
        }
//         bug($data['alias']);
        return $data;
	}

	public function existed($table,$where=null){
	    $data = $this->db->where($where)->get($table)->row();

	    return ( $data && !empty($data) ) ? $data->id : false;

	}

	function insert($table='',$data=array()){
	    $data['id'] = 0;
	    if ( $this->common->field_exists('modified',$table) ) {
	        $data['modified'] = date('Y-m-d H:i:s');
	    }
	    $this->common->insert($table, $data);
	    $id= $this->common->insert_id();

	    return $id;
	}

	function get($id=0,$table='',$lang_fields=NULL){

	    $data = $this->db->where('id',$id)->get($table)->row();
	    if( $lang_fields ){

	        foreach ($lang_fields AS $lang){
	            $data->$lang = $this->Lang_Model->lines($table,$lang,$data->id);
	        }
	    }
	    return $data;
// 	    bug($data);die;
	}

}