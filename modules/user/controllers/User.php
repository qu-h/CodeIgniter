<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class User extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->model('User_Model');
        $this->load->module('layouts');
        $this->template->set_theme('smartadmin')->set_layout('main');
        $this->fields = $this->User_Model->fields();
    }

    var $table_fields = array(
        'id'=>array("#",5,true,'text-center'),
        'fullname'=>array("Fullname"),
        'email'=>array('email'),
        'actions'=>array(),
    );
    function items(){

        if( $this->uri->extension =='json' ){
            return $this->User_Model->items_json(array_keys($this->table_fields));
        }

        $data = columns_fields($this->table_fields);

        $this->template
            ->build('backend/datatables',$data);
    }

    public function form($id = 0)
    {
        if ($this->input->post()) {
            $data = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $data[$name] = $this->input->post($name);
            }
            $add = $this->User_Model->update($data);
            if( $add ){
                set_error(lang('Success.'));
            }

        } else if ( $id > 0 ){
            $item = $this->User_Model->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
        }

        $data = array(
            'fields' => $this->fields
        );
        $this->template->build('backend/form', $data);
    }

    public function profile($id=0){
        $user = $this->User_Model->get_item_by_id($id);
        $this->template->build('user/profile');
    }


}