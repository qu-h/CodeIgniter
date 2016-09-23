<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Article extends MX_Controller {

    function __construct()
    {
        $this->load->module('layouts');

        $this->template->set_theme('smartadmin')->set_layout('main');
    }

    function items(){
        $data = array();
//         $data['page_header'] = $this->template->view('layouts/page_header',null,true);


    	$this->template
    	->title( lang('welcome_to').' '.config_item('company_name') )
    	->build('backend/datatables',$data);
// bug($this->template);die;
//         $this->load->view('login');
    }

    var $fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'title' => array(
            'label' => 'Category Name',
            'desc' => null,
            'icon' => 'send'
        ),
        'alias' => array(
            'label' => 'Category Alias',
            'desc' => null,
            'icon' => 'link'
        ),
        'cateogry' => array(
            'type' => 'select',
            'icon' => 'list'
        ),
        'content' => array(
            'type' => 'textarea'
        )
    );

    public function form($id=0){
        if ($this->input->post()) {
            $formdata = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $formdata[$name] = $this->input->post($name);
            }
            bug($formdata);die;
            $add = $this->Category_Model->update($formdata);
            if( $add ){
                set_error(lang('Success.'));
            }

        }
//         bug($this->session->flashdata('error'));


        $data = array(
            'fields' => $this->fields
        );
        $this->template
        ->title( lang('welcome_to'))
        ->build('backend/form',$data);
    }
}