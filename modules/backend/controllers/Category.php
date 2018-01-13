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

    var $table_fields = array(
        'id'=>array("#",9,true,'text-center'),
        'title'=>array("Title"),
//        'category'=>array("Category"),

        'actions'=>array(),
    );

    function items()
    {
        $items = $this->Category_Model->items_listview(0);
        $data = columns_fields($this->table_fields);
        $data['categories'] = $items;
        $this->template
            ->title(lang('welcome_to') . ' ' . config_item('company_name'))
            ->build('backend/categories', $data);
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
        'summary'=>array(
            'type' => 'textarea',
            'editor'=>'form-control'
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

        } else if ( $id > 0 ){
            $item = $this->Category_Model->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
        }

        $data = array(
            'fields' => $this->fields
        );
        $this->template->title(lang('welcome_to'))->build('backend/form', $data);
    }
}