<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Menu extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->model('backend/Menu_Model');
        $this->load->module('layouts');
        $this->fields = $this->Menu_Model->fields();
        add_site_structure('menu', lang("Menus Management"));
    }

    var $table_fields = array(
        'id'=>array("#",5,true,'text-center'),
        'name'=>array("Name"),
        'uri'=>array("Uri"),
        'status'=>array("Status"),
        'actions'=>array(),
    );
    function items(){
        if( $this->uri->extension =='json' ){
            return $this->items_json_data(array_keys($this->table_fields));
        }

        $data = columns_fields($this->table_fields);

        $this->template
            ->build('backend/datatables',$data);
    }

    private function items_json_data(){
        $backend = 0;
        if( isset($this->fields['backend']['value']) && $this->fields['backend']['value'] >= 0 ){
            $backend = $this->fields['backend']['value'];
        }
        $this->Menu_Model->items_json($backend);
    }

    public function form($id=0){
        if ($this->input->post()) {
            $formdata = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $formdata[$name] = $this->input->post($name);
            }

            $add = $this->Menu_Model->update($formdata);
            if( $add ){
                set_error(lang('Success.'));
                $newUri = url_to_edit(null,$add);
                if( input_post('back') ){
                    $newUri = url_to_list();
                }
                return redirect($newUri, 'refresh');
            }

        }else if ($id > 0) {
            $item = $this->Menu_Model->get_item_by_id($id);
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


        temp_view("backend/form",$data);
    }
}