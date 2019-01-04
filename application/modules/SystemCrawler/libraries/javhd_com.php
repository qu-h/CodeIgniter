<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class javhd_com
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

    public function initialize($config){
        if( array_key_exists('url', $config) ){
            $html = file_get_html($config['url']);
        }

        $get_link = $html->find("div.player-container");
        $str = $get_link[0]->style;
        $name_link = explode('/', $str);
        $final_link = str_replace('-p','',$name_link[4]);


        $this->video = 'http://cs92.wpc.alphacdn.net/802D70B/OriginJHVD/contents/'.$final_link.'/videos/'.$final_link.'_hq.mp4?cdn_hash=d9efb50e13ae7d927ca5d87f9502ed2c&cdn_creation_time=1461863271&cdn_ttl=1200&cdn_cv_memberid=14" ';


    }
}