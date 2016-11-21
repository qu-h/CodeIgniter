<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Article extends MX_Controller {

    function __construct()
    {
        $this->load->model('backend/Article_Model');
        $this->load->model('backend/Category_Model');

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
        'category' => array(
            'type' => 'select',
            'icon' => 'list'
        ),
        'source' => array(
            'type' => 'text',
            'icon' => 'link'
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

    public function crawler(){
        $this->load->module('crawler');
        if( strlen($source = $this->input->get('s')) > 0 ){
             list($c_title,$c_content)= $this->crawler->get_content($source);
             if( is_string($c_title) ){
                 $this->fields['title']['value']=$c_title;
                 $this->fields['alias']['value']= url_title($c_title,'-',true);
             }
             if( is_string($c_content) ){
                 $this->fields['content']['value']=$c_content;
             }

            $this->fields['source']['value']=$source;
        }

        if ($this->input->post()) {
            $formdata = array();
            foreach ($this->fields as $name => $field) {
                $formdata[$name] = $this->input->post($name);
            }
            if( !empty($formdata) AND ($add = $this->Article_Model->update($formdata)) ){
                set_error(lang('Success.'));
            }

        }


        $data = array(
            'fields' => $this->fields
        );
        $this->template
        ->title( lang('welcome_to'))
        ->build('backend/form',$data);
    }
}