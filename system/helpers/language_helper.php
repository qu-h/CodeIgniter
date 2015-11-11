<?php defined('BASEPATH') OR exit('No direct script access allowed');

if ( ! function_exists('lang')) {
	/**
	 * Lang
	 *
	 * Fetches a language variable and optionally outputs a form label
	 *
	 * @param	string	$line		The language line
	 * @param	string	$for		The "for" value (id of the form element)
	 * @param	array	$attributes	Any additional HTML attributes
	 * @return	string
	 */
	function lang($line, $for = '', $attributes = array(),$language='') {

		$text = get_instance()->lang->line($line,false,$language);
		if( !$text ){
		    $text = $line;
		}

		if ($for !== '') {
			$line = '<label for="'.$for.'"'._stringify_attributes($attributes).'>'.$text.'</label>';
		}

		return $text;
	}
	function langdb($table,$field,$taget){
        $ci = get_instance();
        if( !method_exists ( $ci , 'Lang_Model' ) ){
            $ci->load->model('Lang_Model');
        }
        return $ci->Lang_Model->line(false,$table,$field,$taget);
	}

	function lang_query($table,$field,$taget,$lang='vn',$return=null){
	    $ci = get_instance();
	    if( !method_exists ( $ci , 'Lang_Model' ) ){
	        $ci->load->model('Lang_Model');
	    }
	    return $ci->Lang_Model->line(true,$table,$field,$taget,$lang,$return);
	}
}
