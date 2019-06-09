<?php
function smarty_modifier_env($tag_arg){

    if( strlen($tag_arg) > 0 ){
        return env($tag_arg);
    }
}
