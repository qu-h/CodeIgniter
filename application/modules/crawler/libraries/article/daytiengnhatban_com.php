<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_daytiengnhatban_com
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


        $this->title = trim($html->find('article h2[class=title]',0)->plaintext);
        foreach ( $html->find('article div[class=entry] div[class="love-received"]') AS $LoveArea){
                $LoveArea->outertext = "";
        }
        
        $this->content = trim($html->find('article div[class=entry]',0)->innertext);
// bug($this->content);die;

    }


}