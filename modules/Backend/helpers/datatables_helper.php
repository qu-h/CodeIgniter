<?php
function columns_fields($fields= array()){
    /*
     * https://datatables.net/reference/option/columns.render
     */
    $columns_fields = NULL;
    foreach ($fields AS $k=>$f){
        
        $col_data = "data:'$k'";
        $col_order = NULL;
        if( isset($f[2]) &&  $f[2] != true ){
            $col_order = ',"orderable": false';
        }
        $col_width = NULL;
        if( isset($f[1]) &&  is_numeric($f[1]) ){
            $col_width = ',"width": "'.$f[1].'%"';
        }
    
        $col_class=NULL;
        if( isset($f[3]) &&  is_string($f[3]) ){
            $col_class = ',"className": "'.$f[3].'"';
        }
    
    
        $content_default = NULL;
        if( $k=='actions' ){
            $col_data = "data:null";
            $content_default = ', "defaultContent" : \'<button class="btn btn-xs btn-default" data-action="edit" ><i class="fa fa-pencil"></i></button>\'';
        }
        $columns_fields .= "{ $col_data $col_order $col_width $content_default $col_class},";
    }
    $columns_fields = substr($columns_fields, 0,-1);
    return $columns_fields;
}