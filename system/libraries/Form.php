<?php
class CI_Form {
	var $fields = NULL;
	var $CI=NULL;
	function __construct(){
		$this->CI = & get_instance();
	}
	public function bindFields($fields=NULL,$data=NULL){
		if( !is_array($fields) || !$fields){
			return NULL;
		}
		if( is_array($fields) ){
			foreach ($fields AS $key=>$field) {

				if( !isset($field['value']) ) $field['value'] = NULL;
				if( !isset($field['type']) ) $field['type'] = 'text';
				if( !isset($field['lang']) ) $field['lang'] = false;

				if( !isset($field['title']) ) {
					$title = explode('_', $key);
					$field['title'] = NULL;
					foreach ($title AS $titleVal){
						$field['title'].=' '.ucfirst($titleVal);
					}

					$field['title'] = lang(trim($field['title']));

				}
				switch ($field['type']){
					case 'category':
						$type = ( isset($field['datatype']) )?$field['datatype']:NULL;
						//$field['options'] = $this->CI->CategoryModel->getOptions($type);
						break;
					case 'pictogram':
						if( !method_exists($this->CI,'PictogramModel') ){
							$this->CI->load->model('PictogramModel');
						}

						$type = ( isset($field['datatype']) )?$field['datatype']:NULL;
						$field['options'] = $this->CI->PictogramModel->getOptions($type);
						break;
					case 'company':
						if( !method_exists($this->CI,'CompanyModel') ){
							$this->CI->load->model('CompanyModel');
						}
						$field['options'] = $this->CI->CompanyModel->getOptions();
						break;

					case 'type_compounds':
						if( !method_exists($this->CI,'TypeCompoundsModel') ){
							$this->CI->load->model('TypeCompoundsModel');
						}
						$field['options'] = $this->CI->TypeCompoundsModel->getOptions();
						break;
					case 'input_float':
						$mg_l_input = array('aquaticacute_lc50','aquaticacute_ec50','aquaticacute_erc50');
						if( in_array($key, $mg_l_input) ){
// 							die('set unit');
							$field['unit'] = $this->CI->nippon->mg_l;
						}


					default: break;
				}
				if( !isset($field['value']) ){
					$field['value'] = null;
				}

				if( is_array($data) && array_key_exists($key, $data) ){
					$field['value'] = $data[$key];
				} else if ( $data && isset($data->$key) ){
					$field['value'] = $data->$key;
				}

				$this->fields[$key] = $field;
			}
		}
		//return $this->fields;
	}

	var $postData = NULL;

	public function submitData($sendtoFields=false){
		if( !$this->CI->input->post()){
			return FALSE;
		}

		$data = NULL;
		$success = TRUE;

		foreach ($this->fields AS $key=>$field) {

			switch ($field['type']){
				case 'image':
				case 'images':
					$dir = ( isset($field['dir']) && $field['dir'])?$field['dir']:'uploads';
					$file = self::uploadImg($key,$dir);
					if( $file ){
						$this->postData[$key] = $file;
					}

					break;
				case 'status':
					$this->postData[$key] = ( $this->CI->input->post($key) == 'on')?1:0;break;
				case 'price':
					$number = $this->CI->input->post($key);
					$trans = array(
						'&.+?;'                 => '',
						'[^0-9]'          => '',
						'\s+'                   => '',
						//'('.$q_separator.')+'   => ''
					);
					foreach ($trans as $ke => $val){
						$number = preg_replace("#".$ke."#i", $val, $number);
					}
					$this->postData[$key] = $number;
					break;
				case 'vehicles':
				case 'services':
				case 'schedule':
				case 'categorymulti':

					$this->postData[$key] = json_encode( $this->CI->input->post($key) );
					break;
				case 'time':
					$this->postData[$key] = '{"day":'.$this->CI->input->post($key.'-day').',"night":'.$this->CI->input->post($key.'-night').'}';
					break;
				default:
                    $post = $this->CI->input->post($key);

                    //if( $post != null ){
                    	$this->postData[$key] = ( is_array($post))? $post: trim($post);
                    //}
						break;
			}

			if( $sendtoFields ){
				$this->fields[$key]['value'] = $this->postData[$key];
			}

		}

		if ( ! function_exists('convert_accented_characters')){
			$this->CI->load->helper('text');
		}

		if( array_key_exists('alias', $this->fields) && array_key_exists('title', $this->postData) && !array_key_exists('alias', $this->postData) ){
			$alias = convert_accented_characters($this->postData['title']);
			$this->postData['alias'] = url_title($alias,'-',TRUE);
		}
// bug($this->CI->input->post('captcha')); die;
		if( array_key_exists('captcha', $_POST) ){

			$checkCaptcha = $this->CI->Common_Model->checkCaptcha($this->CI->input->post('captcha'));
			if( $checkCaptcha != true ){
				$this->CI->error('The security code entered was incorrect');
// 				bug( $this->CI->error );
				$success = false;
			}

		}
		return $success;

	}

	private function uploadImg($fieldKey=NULL,$dir=NULL){
	    if( !isset($_FILES[$fieldKey]['tmp_name']) || !$_FILES[$fieldKey]['tmp_name']) return false;

		if( !$dir ){
			$dir = 'uploads';
		}
		$this->CI->load->helper('file');
		check_dir($dir);
        if( is_dir($dir)){
            $config['upload_path'] = $dir;
        } else {

            $config['upload_path'] = BASEPATH.'../files/'.$dir;
        }

		$config['allowed_types'] = 'gif|jpg|png';

		$this->CI->load->library('upload', $config);


		if ( ! $this->CI->upload->do_upload($fieldKey) ){
		    bug($this->CI->upload->error_msg);
			die('can not upload');
		} else {
			$newFile = array(
				'name'=>$this->CI->upload->file_name,
				'size'=>$this->CI->upload->file_size
			);
			return $this->CI->upload->file_name;
		}

		return NULL;
	}

	function ajaxTableField($field=null){
		$field = array_keys($field);
		$select = null;
		foreach( $field AS $k=>$val ){
			if( $val =='actions' ){

			} else {
				$select.= ",$val";
			}
		}
		return substr($select, 1);
	}

}