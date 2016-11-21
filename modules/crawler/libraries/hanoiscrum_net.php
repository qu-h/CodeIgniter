<?php
//if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class hanoiscrum_net
{

    function __construct($config = array())
    {
        $this->_ci =& get_instance();

        if ( !empty($config))
        {
            $this->initialize($config);
        }
    }

    var $html, $title, $content = NULL ;

    /*
     * http://simplehtmldom.sourceforge.net/manual.htm
     */
    public function initialize($config){
        if( array_key_exists('url', $config) ){
            $html = file_get_html($config['url']);
        }

        foreach( $html->find('h1[class="article-title]') as $content){
            $this->title = trim($content->plaintext);
        }

        foreach( $html->find('section[class=article-content]') as $content){
            $this->content = trim($content->innertext);
        }
    }



    function content($url){

//         $ch = curl_init();
//         curl_setopt($ch, CURLOPT_URL, $url);
//         curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//         curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
//         $site_content = curl_exec($ch);
//         curl_close($ch);

//         $content = get_str_between($site_content,'<div id="main-a">','<div id="sidebar">');


//         $html = new simple_html_dom();
//         $html->load($site_content);

//         $content = $html->find('<div id="main-a">')->plaintext;



//         $dom = new DOMDocument('1.0');
// //         @$dom->loadHTMLFile($url);
//         @$dom->loadHTML($site_content);

//         $content = $dom->getElementsByTagName('body');
        foreach( $html->find('h1[class="article-title]') as $content){
            bug($content->plaintext);
        }

        foreach( $html->find('section[class=article-content]') as $content){
            bug($content->innertext);
        }
        $html->clear();
        unset($html);
// bug($content); die;
        die();
//

//         return $html;
    }
}