<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_pcworld_com_vn
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

            // create curl resource
            $ch = curl_init();

            // set url
            curl_setopt($ch, CURLOPT_URL, $config['url']);

            //return the transfer as a string
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');

            // $output contains the output string
            $contents = curl_exec($ch);

            // close curl resource to free up system resources
            curl_close($ch);
            $html = new simple_html_dom();
            $html->load($contents);
        }

//         foreach ( $html->find('article div[class=td-post-content] div[class=td-a-rec]') AS $adv){
//             $adv->outertext = "";
//         }

//         foreach ( $html->find('article div[class=td-post-content] div') AS $adv2){
//             if( !isset($adv2->class) OR strlen($adv2->class) < 1 ){
//                 $adv2->outertext = "";
//             }
//         }

        foreach($html->find('img') as $element){
            $element->src = '//pcworld.com.vn/'.$element->src;
        }


        $this->title = trim($html->find('div[class="title"] h1',0)->innertext);
        $summary = trim($html->find('div.summary',0)->innertext);
        $this->content = trim($html->find('div#ar-content-html',0)->innertext);

        $this->content = "<p>$summary</p>".$this->content;


    }


}