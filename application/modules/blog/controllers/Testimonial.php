<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Testimonial extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('Testimonial_Model');
        $this->load->module('layouts');
        $this->fields = $this->Testimonial_Model->fields();
        set_temp_val('img_path',"testimonial");
        add_site_structure('testimonial',lang("Testimonial of Customer") );
    }

    var $table_fields = array(
        'id'=>array("#",5,true,'text-center'),
        'fullname'=>array("Customer Name"),
        'content'=>array("Customer Comment"),
        'actions'=>array(),
    );
    function items(){

        if( $this->uri->extension =='json' ){
            return $this->Testimonial_Model->items_json();
        }

        $data = columns_fields($this->table_fields);

        $this->template->build('backend/datatables',$data);
    }

    var $formView = "backend/form";
    public function form($id=0){
        if ($this->input->post()) {

            $formdata = array();

            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $formdata[$name] = $this->input->post($name);
            }

            $add = $this->Testimonial_Model->update($formdata);
            if( $add ){
                set_error(lang('Success.'));
                $newUri = url_to_edit(null,$add);
                if( input_post('back') ){
                    $newUri = url_to_list();
                }
                return redirect($newUri, 'refresh');
            }

        } else {
            $item = $this->Testimonial_Model->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
        }
        if( $id > 0 ){
            set_temp_val('formTitle',lang("Edit") );
        } else {
            set_temp_val('formTitle',lang("Add new") );
        }

        $data = array(
            'fields' => $this->fields
        );

        temp_view($this->formView,$data);
    }
}