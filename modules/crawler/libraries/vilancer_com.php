<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_vilancer_com
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

        $content_attribute = 'div[class=article-content] div[class=entry-content]';
//         foreach ( $html->find('article div[class=td-post-content] div[class=td-a-rec]') AS $adv){
//             $adv->outertext = "";
//         }

//         foreach ( $html->find('article div[class=td-post-content] div') AS $adv2){
//             if( !isset($adv2->class) OR strlen($adv2->class) < 1 ){
//                 $adv2->outertext = "";
//             }
//         }

        $this->title = trim($html->find('header[class="entry-header"] h1',0)->plaintext);

        $content = $html->find('div[class=article-content] div[class=entry-content]');
        foreach ( $html->find("$content_attribute div[id=wp_rp_first]") AS $readmore){
            $readmore->outertext = "";
        }
        $this->content = trim($html->find($content_attribute,0)->innertext);

//         foreach ( $html->find('article div[class=td-post-content] a') AS $link){
//            $this->out_links[] = $link->href;
//         }
// bug($this);die('bug');

    }


}