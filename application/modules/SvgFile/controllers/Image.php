<?php

if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Image extends MX_Controller
{

    function __construct ()
    {
        parent::__construct();
    }

    public function index ()
    {
        die("svg image index");
    }

    public function thumb ($width = 100, $height = 100)
    {
        $data = array(
                'textColor'=>'AAAAAA',
                'borderColor'=>'EEEEEE',
                'width' => $width,
                'height' => $height,
                'text'=>$width . "x" . $height,
        );

        $this->load->view('image-thumb', $data);
    }
}