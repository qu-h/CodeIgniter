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
//        $html = new simple_html_dom();
        if( array_key_exists('url', $config) ){
            $html = file_get_html($config['url']);
            // create curl resource
//            $ch = curl_init();
//
//            // set url
//            curl_setopt($ch, CURLOPT_URL, $config['url']);
//
//            //return the transfer as a string
//            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//            curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
//
//            // $output contains the output string
//            $contents = curl_exec($ch);
//
//            // close curl resource to free up system resources
//            curl_close($ch);
//
//            $html->load($contents);
//            bug($contents);die;
        }

        $this->title = trim($html->find('h1',0)->plaintext);
        $this->content = trim($html->find('div.post-content',0)->innertext);

    }


}