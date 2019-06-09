<?php
/**
 * https://github.com/showdownjs/showdown
 * http://demo.showdownjs.com/#/introduction
 */


class BaseMarkdown extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
//        $this->load->library('ParseDown');

    }

    public function read($md_file){
        $parseDown = new CI_Parsedown();
        $parseDown->setImageUrl(env('MARKDOWN_URL'));
        $data = file_get_contents($md_file);
        return $parseDown->text($data);
    }
}