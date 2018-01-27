<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_laptrinhandroid_vn
{
    function __construct($config = array())
    {
        if ( !empty($config))
        {
            $this->initialize($config);
        }
    }

    var $title, $content = NULL ;
    var $out_links = array();

    public function initialize($config){
//        $html = new simple_html_dom();
        if( array_key_exists('url', $config) ){
            $html = file_get_html($config['url']);

        }

        $this->title = trim($html->find('h1.entry-title',0)->plaintext);
        $this->content = trim($html->find('div.entry-content',0)->innertext);

    }


}