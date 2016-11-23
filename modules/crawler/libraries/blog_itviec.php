<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_blog_itviec
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
// bug($contents);die;
            $html = new simple_html_dom();
            $html->load($contents);
        }

        foreach( $html->find(' div[id=main-a] h1[class="title"] ') as $content){
            $this->title = trim($content->plaintext);
        }

        foreach( $html->find(' div[id=main-a] div[class="content"] ') as $content){
            $this->content = trim($content->innertext);
        }
    }

}