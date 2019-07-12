<?php
function smarty_modifier_lang($tag_arg){

    if( strlen($tag_arg) > 0 ){
        return lang($tag_arg);
    }
}
