<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Dbconfig extends MX_Controller
{

    function __construct()
    {
        $this->load->module('layouts');
        $this->load->model('backend/DBConfig_Model');
        $this->fields = $this->DBConfig_Model->fields();
    }

    var $table_fields = array(
        'id' => array("#"),
        'name' => array("name"),
        'value' => array("Value"),
        'actions' => array(NULL, 5, false),
    );

    function items()
    {
        /*
        $js = add_js('test.js');
        */
        if ($this->uri->extension == 'json') {
            $this->DBConfig_Model->items_json(1);
        }

        $data = columns_fields($this->table_fields);
        $this->template->build('backend/datatables', $data);
    }


    public function form($id=0){
        if ($this->input->post()) {
            $formdata = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $formdata[$name] = $this->input->post($name);
            }
            $config['upload_path']    = APPPATH."/uploads/config/";
            $config['allowed_types']  = 'gif|jpg|png|jpeg';
            $this->load->library('upload', $config);
            if ( $this->upload->do_upload('imgthumbUpload') ){
                $upload_data = $this->upload->data();
                $formdata["imgthumb"] = $upload_data['file_name'];
            } else {
                //$formdata["imgthumb"] = NULL;
                //bug($this->upload->display_errors());die;
            }


                $add = $this->DBConfig_Model->update($formdata);
                if( $add ){
                    set_error(lang('Success.'));
                    $newUri = url_to_edit(null,$add);
                    return redirect($newUri, 'refresh');
                }

        } else {
            $item = $this->DBConfig_Model->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
        }
        if( $id > 0 ){

            set_temp_val('formTitle',lang("Edit Config") );
        } else {
            set_temp_val('formTitle',lang("Add new Config") );
        }

        $data = array(
            'fields' => $this->fields
        );

        temp_view('backend/form',$data);
    }
}