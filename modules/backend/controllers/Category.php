<?php
if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Category extends MX_Controller
{

    function __construct()
    {
        $this->load->module('layouts');
        $this->template->set_theme('smartadmin')->set_layout('main');
        $this->load->model('backend/Category_Model');

    }

    function items()
    {
        $data = $this->Category_Model->items_listview(0);
        $this->template
            ->title(lang('welcome_to') . ' ' . config_item('company_name'))
            ->build('backend/categorys', $data);
    }

    var $fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'name' => array(
            'label' => 'Category Name',
            'desc' => null,
            'icon' => 'send'
        ),
        'alias' => array(
            'label' => 'Category Alias',
            'desc' => null,
            'icon' => 'link'
        ),
        'parent' => array(
            'type' => 'select',
            'icon' => 'list'
        ),
        'description' => array(
            'type' => 'textarea'
        )
    );

    public function form($id = 0)
    {
        if ($this->input->post()) {
            $data = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $data[$name] = $this->input->post($name);
            }
            $add = $this->Category_Model->update($data);
            if( $add ){
                set_error(lang('Success.'));
            }

        }

        $data = array(
            'fields' => $this->fields
        );
        $this->template->title(lang('welcome_to'))->build('backend/form', $data);
    }
}