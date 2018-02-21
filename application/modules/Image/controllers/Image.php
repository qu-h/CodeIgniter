<?php defined('BASEPATH') OR exit('No direct script access allowed');

class Image extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->helper(['path','directory2']);
    }

    public function crop(){
        $config = [];
        $uri_length = $this->uri->total_segments();
        $resize = $this->uri->rsegment($uri_length-1);

        $path = uri_string();
        $path = str_replace("images/thumb",null,$path);
        $path = str_replace($resize.DS,null,$path);
        $path_info = pathinfo($path);
        $pathFile = realpath(APPPATH."images/".$path_info["dirname"]);
        $config['new_image_path'] = APPPATH."images/thumb".$path_info["dirname"].DS.$resize;
        $config['source_image'] = realpath($pathFile.DS.$path_info["basename"]);
        $config['new_image'] = $config['new_image_path'].DS.$path_info["basename"];
        //$config['filename'] = $path_info["basename"];
        $config['filename'] = $path_info["filename"];
        $config['extension'] = $path_info["extension"];


        if( substr($resize,0,1)=='w' ){
            $config['width']         = intval(str_replace('w',null,$resize));
            $config['height']         = $config['width']/2;
        } else if (substr($resize,0,1)=='h') {
            $config['height']         = intval(str_replace('h',null,$resize));
            $config['width']         = $config['height']*2;
        } else if (substr($resize,0,1)=='s'){
            $config['width']  = $config['height']   = intval(str_replace('s',null,$resize));
            if( file_exists($config['source_image']) ){

                return $this->resize($config);
            }

        }

        die("call me");
    }
    public function thumbCreate()
    {

        $config = [];
        $uri_length = $this->uri->total_segments();
        $resize = $this->uri->segment($uri_length-1);
        $segments = $this->uri->segment_array();


        $filename = $this->uri->segment($uri_length);
        unset($segments[$uri_length]);


        $thumbType = $uri_length > 1 ? $segments[$uri_length - 1] : NULL;
        unset($segments[$uri_length - 1]);
        $filePath = APPPATH . implode("/", $segments);

        $path = uri_string();
        $path = str_replace("images/thumb",null,$path);
        $path = str_replace($resize.DS,null,$path);
        $path_info = pathinfo($path);
        $pathFile = realpath(APPPATH."images/".$path_info["dirname"]);

        $config['new_image_path'] = APPPATH.$path_info["dirname"].DS.$resize;
        $config['source_image'] = realpath($filePath.DS.$path_info["basename"]);
        $config['new_image'] = $config['new_image_path'].DS.$path_info["basename"];

        $config['filename'] = $path_info["filename"];
        $config['extension'] = $path_info["extension"];

        if( substr($resize,0,1)=='w' ){
            $config['width']         = intval(str_replace('w',null,$resize));
            //$config['height']         = $config['width']/2;
        } else if (substr($resize,0,1)=='h') {
            $config['height']         = intval(str_replace('h',null,$resize));
            //$config['width']         = $config['height']*2;
        } else if (substr($resize,0,1)=='s'){
            $config['width']  = $config['height']   = intval(str_replace('s',null,$resize));
        }

        return $this->resize($config);
    }

    public function cropSquare($inputConfig=[]){
        $config = $inputConfig;

        if( !isset($config['new_image_path']) ){
            return false;
        }
        if( !is_dir($config['new_image_path']) ){
            mkdir_full($config['new_image_path'], 0655);
        }


        if( !file_exists($config['new_image']) ){

            $config['image_library'] = 'gd2';
            $config['maintain_ratio'] = TRUE;
            $config['width']         = 900;
            $config['height']       = 900;

            $this->load->library('image_lib');

            //if( $config['square'] ){

                $imageSize = $this->image_lib->get_image_properties($config['source_image'], TRUE);
//
                if ($imageSize['width'] > $imageSize['height']) {
                    $config['x_axis'] = round(($imageSize['width'] / 2) - ($imageSize['height'] / 2));
                } else {
                    $config['y_axis'] = round(($imageSize['height'] / 2) - ($imageSize['width'] / 2) );
                }

//            $config['create_thumb'] = TRUE;
            $config['maintain_ratio'] = TRUE;


            $this->image_lib->initialize($config);
            $doResize = $this->image_lib->crop();



            if ( !$doResize)
            {
                echo $this->image_lib->display_errors();
                $this->image_lib->clear();
                unset($config);

            } else {
                $this->image_lib->clear();

                unset($config);

                redirect(base_url().uri_string());
            }
            //bug($config);
            die;
        }
    }

    function resize($config){
        if( !is_dir($config['new_image_path']) ){
            mkdir_full($config['new_image_path'], 0655);
        }

        if( file_exists($config['new_image']) ){
            bug($config);
            die("file is exits");
        }
        $this->load->library('image_lib');

        $configResize = $config;

        $image_orig = $this->image_lib->get_image_properties($config['source_image'], TRUE);
        $rate = min($image_orig["width"]/$config["width"],$image_orig["height"]/$config["height"]);
        $configResize['width'] = round($image_orig["width"]/$rate);
        $configResize['height'] = round($image_orig['height']/$rate);
        $filename_old = $config["filename"].".".$config["extension"];
        $filename_new = $config["filename"]."-".$configResize['width']."x".$configResize['height'].".".$config["extension"];
        $configResize['new_image'] = str_replace($filename_old,$filename_new,$configResize['new_image']);

        $this->image_lib->initialize($configResize);
        $this->image_lib->resize();
        $this->image_lib->clear();

        $filename_new = $config["filename"]."-".$config['width']."x".$config['height'].".".$config["extension"];
//        $config['new_image'] = str_replace($filename_old,$filename_new,$config['new_image']);
        $config['source_image'] = $configResize['new_image'];

        if ($configResize['width'] > $configResize['height']) {
            $config['x_axis'] = round(($configResize['width'] / 2) - ($configResize['height'] / 2));
        } else {
            $config['y_axis'] = round(($configResize['height'] / 2) - ($configResize['width'] / 2) );
        }

        $config["maintain_ratio"] = FALSE;

        $this->image_lib->initialize($config);
        $doResize = $this->image_lib->crop();

        if ( !$doResize)
        {
            echo $this->image_lib->display_errors();
            $this->image_lib->clear();
            unset($config);
            die("do resize have error");
        } else {
            $this->image_lib->clear();
            unlink($configResize['new_image']);
            unset($config);
            redirect(base_url().uri_string());
        }

    }

    public function cropRectangle(){
        $path = uri_string();
        $uri_length = $this->uri->total_segments();
        $resize = $this->uri->rsegment($uri_length-1);
        $path = str_replace("images/thumb",null,$path);
        $path = str_replace($resize.DS,null,$path);
        $pathinfo = pathinfo($path);

        $pathFile = realpath(APPPATH."images/".$pathinfo["dirname"]);
        $pathThumb = APPPATH."images/thumb".$pathinfo["dirname"].DS.$resize;

        if( !is_dir($pathThumb) ){
            mkdir_full($pathThumb, 0655);
        }

        $imgThumb = $pathThumb.DS.$pathinfo["basename"];
        if( !file_exists($imgThumb) ){

            $config['image_library'] = 'gd2';
            $config['source_image'] = realpath($pathFile.DS.$pathinfo["basename"]);
            $config['new_image'] = $imgThumb;
            $config['maintain_ratio'] = TRUE;
            $config['width']         = 50;
            $config['height']       = 25;
            if( substr($resize,0,1)=='w' ){
                $config['width']         = intval(str_replace('w',null,$resize));
                $config['height']         = $config['width']/2;
            } else if (substr($resize,0,1)=='h') {
                $config['height']         = intval(str_replace('h',null,$resize));
                $config['width']         = $config['height']*2;
            } else if (substr($resize,0,1)=='s'){
                $config['width']  = $config['height']   = intval(str_replace('s',null,$resize));
                $config['square'] = true;

            }

            $this->load->library('image_lib');

            if( $config['square'] ){

                $imageSize = $this->image_lib->get_image_properties($config['source_image'], TRUE);
                if ($imageSize['width'] > $imageSize['height']) {
                    $config['x_axis'] = round(($imageSize['width'] / 2) - ($config['width'] / 2));
                } else {
                    $config['y_axis'] = round(($imageSize['width'] / 2) - ($config['width'] / 2));
                }
                $config['maintain_ratio'] = false;
            }


            $this->image_lib->initialize($config);
            $doResize = $this->image_lib->resize();



            if ( !$doResize)
            {
                echo $this->image_lib->display_errors();
                $this->image_lib->clear();
                unset($config);

            } else {
                $this->image_lib->clear();
                unset($config);
                redirect(base_url().uri_string());
            }

        }
    }
}