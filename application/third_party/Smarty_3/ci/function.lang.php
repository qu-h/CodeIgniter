<?php
function smarty_function_lang($params){
    if( isset($params['txt']) ){
        return lang($params['txt']);
    }


}
