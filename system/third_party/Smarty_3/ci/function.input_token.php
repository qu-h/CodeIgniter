<?php
function smarty_function_input_token($params,$content){
    $ci = $content->CI;
	return '<input type="hidden" name="'.$ci->security->get_csrf_token_name().'" value="'.$ci->security->get_csrf_hash().'">';;
}
