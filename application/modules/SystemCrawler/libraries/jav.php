<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class jav
{

    function __construct($config = array())
    {

        if( !class_exists('simple_html_dom')  ){
            get_instance()->load->library('crawler/simple_html_dom');
        }
        if ( !empty($config))
        {
            $this->initialize($config);
        }
    }

    var $video, $title = null;
    var $site = "//javfinder.com";

    public function initialize($config){
        if( array_key_exists('url', $config) ){
            $this->site = parse_url($config['url'], PHP_URL_HOST);
            $html = file_get_html($config['url']);
        }
        switch ($this->site){
            case 'javbuz.com':
            case 'jav789.com':
                $this->javbuz($html);
        }

    }

    private function javbuz($dom){

        $this->title = $dom->find('h1[class="title"]',0)->plaintext;
        $this->img = $dom->find('video[id="player"]',0)->poster;
        $this->video = $dom->find('video[id="player"] source[data-res="720p"]',0)->src;

        $this->star = $dom->find('.pornstar-item a',0)->title;
        $this->star_url = "//".$this->site."/".$dom->find('.pornstar-item a',0)->href;
    }
}