<?php
function smarty_function_moduleRun($params){
    $module = isset($params['m']) ? $params['m'] : null;
    if( !is_null($module) ){
        return Modules::run($module);
    }

}
