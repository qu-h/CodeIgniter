<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class javfinder_com
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
    /*
     * http://simplehtmldom.sourceforge.net/manual.htm
     */

    static $site = "//javfinder.com";

    public function initialize($config){
        if( array_key_exists('url', $config) ){
            $html = file_get_html($config['url']);
        }

        $video_url = $html->find('div[id="player"] iframe ',0)->src;
        $video_parse = parse_url($video_url);
//         bug($video_parse);die;
        $this->video = "//".$video_parse['host'].DS.$video_parse['path'];

        parse_str($video_parse['query'], $video_params);
        if( isset($video_params['img']) ){
            $this->img = $video_params['img'];
        }




        $this->title = $html->find('meta[property=og:title]',0)->content;

        foreach( $html->find('div[id=video-detail] div[class=sidebar] div[class=sidebar-vid]') as $content){
            foreach( $content->find('h1[class=sidebar-heading]') AS $header ){
                if($header->innertext=="Starring"){
                    foreach( $content->find('div[class=media-body] h1 a') AS $header_content ){
                        $this->star = $header_content->innertext;
                        $this->star_url = self::$site.$header_content->href;
                    }

                }

                if($header->innertext=="By Studio"){
                    foreach( $content->find('div[class=media-body] h1 a') AS $header_content ){
                        $this->studio = $header_content->innertext;
                        $this->studio_url = self::$site.$header_content->href;
                    }

                }
            }
        }



    }


}