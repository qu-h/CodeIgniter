<?php

if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Image extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->helper('path');
    }

    public function thumbCreate($segments=[]){
        $total_segments = count($segments);
        $filename = $segments[$total_segments-1];
        unset($segments[$total_segments-1]);
        $thumbType = $segments[$total_segments-2];
//        $thumbPath = APPPATH."images/".implode("/",$segments);
        unset($segments[$total_segments-2]);
        $filePath = APPPATH."images/".implode("/",$segments);

        if( is_file($filePath.DS.$filename) ){
            $do = $this->generateThumb($filePath,$filename,$thumbType);
            if( $do === TRUE ){
                redirect(base_url().uri_string());
            } else {
                bug($do);die;
            }

        }
        return FALSE;

    }

    private function generateThumb($sourcePath,$filename,$resize){
        $thumbPath = $sourcePath.DS.$resize;
        if( !is_dir($thumbPath) ){
            mkdir_full($thumbPath, 0655);
        }

        $config['image_library'] = 'gd2';
        $config['source_image'] = realpath($sourcePath.DS.$filename);
        $config['new_image'] = $thumbPath.DS.$filename;
        $config['maintain_ratio'] = TRUE;
        $config['width']         = 50;
        $config['height']       = 25;


        if( file_exists($config['new_image']) ){
            return TRUE;
        }
        if( substr($resize,0,1)=='w' ){
            $config['width']         = intval(str_replace('w',null,$resize));
            $config['height']         = $config['width']/2;
        } else if (substr($resize,0,1)=='h') {
            $config['height']         = intval(str_replace('h',null,$resize));
            $config['width']         = $config['height']*2;
        } else if (substr($resize,0,1)=='s'){
            $config['width']  = $config['height']   = intval(str_replace('s',null,$resize));
            $config['square'] = true;
            $config['maintain_ratio'] = FALSE;
        }

        $this->load->library('image_lib');
        $doCache = false;
        if( isset($config['square']) ){
            $imageSize = $this->image_lib->get_image_properties($config['source_image'], TRUE);
            $sourceRatio = round($imageSize['width']/$imageSize["height"],2);
            $oldMinSize = min($imageSize['width'],$imageSize['height']);
            $thumbRatio = round($config['width']/$config["height"],2);
            $thumbMinSize = min($config['width'],$config['height']);
            $size = $sourceRatio > 1 ? $imageSize['height'] : $imageSize['width'];
            $squareCache = $sourcePath.DS."s".$size.DS.$filename;

            if( $thumbRatio != $sourceRatio && $thumbMinSize != $oldMinSize ){

                if( !file_exists($squareCache) ){
                    $doCache = true;
                    $this->generateThumb($sourcePath,$filename,"s".$size);
                }

                $config['source_image'] = realpath($squareCache);

                $config['square'] = false;
            }
            $config['maintain_ratio'] = $size/$config['width'];
            if( $sourceRatio > 1 ){
                $config['x_axis'] = input_get("x_axis");
                if( strlen($config['x_axis']) < 1 ){
                    $config['x_axis'] = (($imageSize['width'] / 2) - ($config['width'] / 2));
                }

            } else {
                $config['y_axis'] = input_get("y_axis");
                if( strlen($config['y_axis']) < 1 ){
                    $config['y_axis'] = (($imageSize['height'] / 2) - ($config['height'] / 2));
                }

            }

        }

        $this->image_lib->initialize($config);
        if( !$config['maintain_ratio'] ){
            $do = $this->image_lib->crop();
        } else {
            $do = $this->image_lib->resize();
        }


        if ( !$do)
        {
            return $this->image_lib->display_errors();
        }
        $this->image_lib->clear();
        unset($config);
        if( $doCache ){
            //unlink($squareCache);
        }
        return TRUE;
//        if(  )
    }
}