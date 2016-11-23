<?php
function smarty_function_input_token($params,$content){
    $ci = get_instance();
	return '<input type="hidden" name="'.$ci->security->get_csrf_token_name().'" value="'.$ci->security->get_csrf_hash().'">';;
}
