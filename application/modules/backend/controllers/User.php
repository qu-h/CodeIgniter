<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class User extends MX_Controller {

    function __construct()
    {
        $this->load->model('backend/Account_Model');
    }

    function login(){
        if ($this->session->userdata('uid')) {
            redirect('', 'location');
        }
        if ($this->input->post()) {
            $post = array(
                'username' => $this->input->post('username'),
                'password' => $this->input->post('password'),
            );
            $login = $this->Account_Model->checklogin($post);
            if ($login) {
                if ($this->uri->segment(2)) {
                    $back = base64_decode($this->uri->segment(2));
                } else {
                    $back = '';
                }
                $this->session->set_userdata('uid', $login);
                redirect($back, 'location');
            }
            bug($login);
        }
        
//        $this->load->module('layouts')->library('layouts/template');
    	$this->template->build('backend/user_login');
    }
}