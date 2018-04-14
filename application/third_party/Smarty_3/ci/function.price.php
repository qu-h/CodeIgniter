<?php
function smarty_function_price($params){
    if( isset($params['num']) ){
        $number = floatval($params['num']);
        return number_format($number,0).' '.lang('VND') ;
    }


}
