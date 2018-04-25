<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class User extends MX_Controller {

    function __construct()
    {

    }

    function login(){
        $this->load->module('layouts')->library('layouts/template');

    	$this->template
    	->title( lang('welcome_to').' '.config_item('company_name') )
    	->set_theme('smartadmin')
    	->set_layout('login_layout')
    	->build('backend/user_login');
// bug($this->template);die;
//         $this->load->view('login');
    }
}