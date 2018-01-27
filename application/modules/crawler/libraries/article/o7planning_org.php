<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_o7planning_org
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
        if( array_key_exists('url', $config) ){
            $html = file_get_html($config['url']);
        }

        $this->title = trim($html->find('head title',0)->plaintext);
        $this->content = trim($html->find('div#main',0)->innertext);

    }


}