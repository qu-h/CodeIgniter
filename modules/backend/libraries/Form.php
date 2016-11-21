<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

class CI_Form
{
    var $img_upload_dir = "";
    function __construct($config = array())
    {
        $this->input =& get_instance()->input;
        if ( !empty($config))
        {
            $this->initialize($config);
        }

        if( strlen($img_upload_dir = config_item('img_upload_dir')) > 1 ){
            $this->img_upload_dir = $img_upload_dir;
        } else {
            $this->img_upload_dir = APPPATH."upload/images/";
        }

        if( strlen($img_upload_url = config_item('img_upload_url')) > 1 ){
            $this->img_upload_url = $img_upload_url;
        } else {
            $this->img_upload_url = get_instance()->config->item('base_url')."/upload/images/";
        }

        $this->mimes = get_mimes();
        $this->img_type_allow = array('jpg','png');
    }

    var $fields = array();

    function add_fields($fields=array()){
        if( !empty($fields) ) foreach ($fields AS $name=>$field){
            if( !array_key_exists($name, $this->fields) ){
                $this->fields[$name] = $field;
            }
        }
        //$this->ci->smarty->assign("fields", $this->fields);
    }

    function bind_data($data=NULL){
        if( !empty($data) AND !empty($this->fields) ){
            foreach ($this->fields AS $name=>$f){
                if( isset($data->$name) ){
                    $this->fields[$name]['value'] = $data->$name;
                }

            }
        }
    }

    function data_array(){
        $data = array();
        foreach ($this->fields AS $name=>$f){
            if( $this->input->post() ){
                $this->fields[$name]['value'] = $this->input->post($name);
            }
            $data[$name] = $this->fields[$name]['value'];
        }
        if( isset($_POST['imgsdata']) AND !empty($images = $this->save_imgs_data())){
            if( !empty($data['images']) ){
                $data['images'] = array_merge($data['images'],$images);
            }else {
                $data['images'] = $images;
            }
        }
        if( !empty($data['images']) ){
            $data['images'] = serialize($data['images']);
        }
        return $data;
    }

    private function save_imgs_data(){
        $imgs_upload = $this->input->post('imgsdata');
        $imgs_name = $this->input->post('imgsname');

        if( !function_exists('write_file') ){
            get_instance()->load->helper('file');
        }

        if( !function_exists('check_directory') ){
            get_instance()->load->helper('directory');
        }

        $upload_dir = check_directory($this->img_upload_dir).DS;

        $images = array();
        if( is_array($imgs_upload) ) foreach ($imgs_upload AS $index=>$imgdata) {
            $img_type = explode(";", $imgdata);
            if( count($img_type) > 1 ){
                $upload_mime = str_replace("data:", NULL, $img_type[0]);

                foreach ($this->img_type_allow AS $img_mime){
                    if( in_array($upload_mime, $this->mimes[$img_mime]) ){

                        $filename = date("Ymd-his").".$img_mime";
                        if( isset($imgs_name[$index]) ){
                            $pathinfo = pathinfo($imgs_name[$index]);

                            $filename = $pathinfo['filename']."-".$filename;
                        }

                        $imgdata = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imgdata));
                        if( write_file($upload_dir.$filename,$imgdata) ){
                            $images[] = $filename;
                        }
                    }
                }



            }

        }
        return $images;
    }


}