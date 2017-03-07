<?php

if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Crawler extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->library('simple_html_dom');
    }

    // var $site_dome =NULL;
    function get_content($url)
    {
        $content = array(
            NULL,
            NULL
        );
        $parse = parse_url($url);

        switch ($parse['host']) {
            case 'blog.itviec.com':
                $this->load->library('blog_itviec', array(
                    'url' => $url
                ));
                $content = array(
                    $this->blog_itviec->title,
                    $this->blog_itviec->content
                );
                break;
            case 'hanoiscrum.net':
                $this->load->library('hanoiscrum_net', array(
                    'url' => $url
                ), 'site_dome');
                $content = array(
                    $this->site_dome->title,
                    $this->site_dome->content
                );
                break;
            case 'techtalk.vn':
                $this->load->library('techtalk_vn', array(
                    'url' => $url
                ), 'site_dome');
                $content = array(
                    $this->site_dome->title,
                    $this->site_dome->content
                );
                break;
            case 'genk.vn':
                $this->load->library('genk_vn', array(
                    'url' => $url
                ), 'site_dome');
                $content = array(
                    $this->site_dome->title,
                    $this->site_dome->content
                );
                break;
            case 'vilancer.com':
                $this->load->library('vilancer_com', array(
                    'url' => $url
                ), 'site_dome');
                $content = array(
                    $this->site_dome->title,
                    $this->site_dome->content
                );
                break;
            case 'pcworld.com.vn':
            case 'www.pcworld.com.vn':
                $this->load->library('pcworld_com_vn', array(
                    'url' => $url
                ), 'site_dome');
                $content = array(
                    $this->site_dome->title,
                    $this->site_dome->content
                );
                break;
//             case 'dantri.com.vn':
//                 $this->load->library('dantri_com_vn', array(
//                 'url' => $url
//                 ), 'site_dome');
//                 $content = array(
//                     $this->site_dome->title,
//                     $this->site_dome->content
//                 );
//                 break;
          case '':
                break;
        }
        // bug($this->site_dome);die;
        // if( isset($this->site_dome) ){

        // $content = array(
        // $this->site_dome->title,
        // $this->site_dome->content
        // );
        // }
        return $content;
    }
}