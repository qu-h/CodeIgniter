<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_viblo_asia
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

            $html = new simple_html_dom();
            $html->load(get_site_html_curl($config['url']));
        }
bug(($config['url']) );die;

//         foreach($html->find('img') as $element){
//             $element->src = '//pcworld.com.vn/'.$element->src;
//         }


        $this->title = trim($html->find('h1.is-markdown-title',0)->innertext);
//         $summary = trim($html->find('div.summary',0)->innertext);
        $this->content = trim($html->find('div.post-content',0)->innertext);
die();
//         $this->content = "<p>$summary</p>".$this->content;


    }


}