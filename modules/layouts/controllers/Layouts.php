<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class Layouts extends MX_Controller {

    function __construct()
    {
        parent::__construct();
        if( !method_exists($this, 'smarty') ){
            $this->load->library('smarty');
        }

    }
    public function index()
    {
        if( !method_exists($this, 'smarty') ){
            $this->load->library('smarty');
        }
        $this->load->library('template');
    }
}

//end