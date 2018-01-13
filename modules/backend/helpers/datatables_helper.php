<?php
function columns_fields($fields= array()){
    /*
     * https://datatables.net/reference/option/columns.render
     */
    $img_path = get_temp_val('img_path');
    $columns_fields = "";
    foreach ($fields AS $k=>$f){
        /*
         * https://datatables.net/reference/option/columns.render
         */
        $field = [
            'data'=>"$k"
        ];
        if( isset($f[3]) ){
            $field["className"] = $f[3];
        }

        if( isset($f[2]) &&  $f[2] != true ){
            $field["orderable"] = false;
        }
        $col_width = NULL;
        if( isset($f[1]) &&  is_numeric($f[1]) ){
            $field["width"] = $f[1].'%';
        }

        $content_default = NULL;
        switch ($k){
            case 'actions':
                $field = [
                    'data'=>null,
                    'orderable'=>false,
                    'className'=>'text-center',
                    'width'=>'10%'
                ];

                $field["defaultContent"] = '<button class="btn btn-xs btn-default" data-action="edit" ><i class="fa fa-pencil"></i></button>';
                $field["defaultContent"].= '<button class="btn btn-xs btn-default" data-action="delete" ><i class="fa fa-times text-danger"></i></button>';
                break;
            case 'imgthumb':
            case 'image':
                $field["render_img"] = base_url()."images/thumb/$img_path/h50/";
                break;
            case 'status':
                $field["className"] = 'text-center';
                $field["status_label"] = true;
                break;
        }

        $columns_fields .= json_encode($field).",";
    }

    $ci = get_instance();
    $data = array('fields'=>$fields,'columns_filter'=>false);
    /*
    $data['page_header'] = $this->template->view('layouts/page_header',null,true);
    */
    $data['data_json_url'] = base_url($ci->uri->uri_string().'.json',NULL);

    $data['columns_fields'] = substr($columns_fields, 0,-1);
    return $data;

}