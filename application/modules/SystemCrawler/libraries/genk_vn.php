<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_genk_vn
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

        foreach ( $html->find('div[id=ContentDetail] div[type=link-content-footer]') AS $bin){
            $bin->outertext = "";
        }

//         foreach ( $html->find('article div[class=td-post-content]') AS $adv2){
//             if( !isset($adv2->class) OR strlen($adv2->class) < 1 ){
//                 $adv2->outertext = "";
//             }
//         }

        $this->title = trim($html->find('title',0)->plaintext);
        $this->content = trim($html->find('div[id=ContentDetail]',0)->innertext);

        foreach ( $html->find('div[id=ContentDetail] a') AS $link){
           $this->out_links[] = $link->href;
        }

    }


}