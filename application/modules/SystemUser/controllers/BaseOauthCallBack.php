<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class BaseOauthCallBack
 * @property Google $google
 * @property CI_Session $session
 */
class BaseOauthCallBack extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
        if( !class_exists('Google')){
//            dd($this->config->item('google_client_id'));
            $this->load->library('SystemUser/Google');
        }

    }

    public function Google(){
        $google_data=$this->google->validate();
        $session_data=[
            'name'=>$google_data['name'],
            'email'=>$google_data['email'],
            'source'=>'google',
            'profile_pic'=>$google_data['profile_pic'],
            'link'=>$google_data['link'],
            'sess_logged_in'=>1
        ];
        dd($google_data);
        $this->session->set_userdata($session_data);
        redirect(base_url());
    }
}