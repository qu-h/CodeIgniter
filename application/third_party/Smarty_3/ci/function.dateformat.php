<?php
function smarty_function_dateformat($params){
    if( isset($params['date']) ){
        if ( ! function_exists('nice_date')) {
            get_instance()->load->helper('date');
        }

        $format = config_item('date_format');
        if( strlen($format) < 3 ){
            $format = 'Y-m-d';
        }
        return nice_date( $params['date'],$format);
    }


}
