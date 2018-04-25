<?php
if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Product extends MX_Controller
{

    function __construct()
    {
        $this->load->module('layouts');
        $this->template->set_theme('smartadmin')->set_layout('main');
        $this->load->model('backend/Product_Model');
        $this->load->library('backend/form');
        $this->form->add_fields($this->fields);

    }

    function items()
    {
        $data = array();
        $this->template->title(lang('welcome_to') . ' ' . config_item('company_name'))->build('backend/categorys', $data);
    }

    var $fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'name' => array(
            'label' => 'Product Name',
            'desc' => null,
            'icon' => 'send'
        ),
        'alias' => array(
            'label' => 'URL Alias',
            'desc' => null,
            'icon' => 'link'
        ),
        'category' => array(
            'type' => 'select',
            'icon' => 'list'
        ),
        'desc_soft' => array(
            'type' => 'textarea'
        ),
        'description' => array(
            'type' => 'textarea'
        ),
        'images' => array(
            'type' => 'multiimage'
        )
    );

    public function form($id = 0)
    {

        if ($this->input->post()) {
            if( $this->Product_Model->update($this->form->data_array()) ){
            }

        }

        if( $id ){
            $this->form->bind_data($this->Product_Model->item($id));
        }

// bug($this->form->fields);die;
        $data = array();
        $this->template
            ->title(lang('welcome_to'))
            ->build('backend/product/form', $data);
    }
}