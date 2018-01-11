<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Caroufredsel extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->module('layouts');
        $this->fields = $this->SlideShow_Model->fields();
    }

    var $table_fields = array(
        'id'=>array("#"),
        'title'=>array("Title"),
        'category'=>array("Category"),
        'source'=>array('Source'),
        'actions'=>array(NULL,5,false),
    );
    function items(){
        if( $this->uri->extension =='json' ){
            //return $this->items_json_data(array_keys($this->table_fields));
            return $this->SlideShow_Model->items_json();
        }

        $data = array('fields'=>$this->table_fields,'columns_filter'=>true);
        /*
        $data['page_header'] = $this->template->view('layouts/page_header',null,true);
        */
        $data['data_json_url'] = base_url($this->uri->uri_string().'.json',NULL);

        $data['columns_fields'] = "";
        foreach ($this->table_fields AS $k=>$f){
            /*
             * https://datatables.net/reference/option/columns.render
             */
            $col_data = "data:'$k'";
            $col_order = NULL;
            if( isset($f[2]) &&  $f[2] != true ){
                $col_order = ',"orderable": false';
            }
            $col_width = NULL;
            if( isset($f[1]) &&  is_numeric($f[1]) ){
                $col_width = ',"width": "'.$f[1].'%"';
            }
            $content_default = NULL;
            if( $k=='actions' ){
                $col_data = "data:null";
                $content_default = ', "defaultContent" : \'<button class="btn btn-xs btn-default" data-action="edit" ><i class="fa fa-pencil"></i></button>\'';
            }
            $data['columns_fields'] .= "{ $col_data $col_order $col_width $content_default},";
        }
        $data['columns_fields'] = substr($data['columns_fields'], 0,-1);


        $this->template
            ->title( lang('welcome_to').' '.config_item('company_name') )
            ->build('backend/datatables',$data);
    }

    var $formView = "SlideShow/caroufredsel-form";

    public function form($id=0){
        if ($this->input->post()) {

            $crawler_source = $this->input->post("crawler_source");

            $formdata = array();

            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $formdata[$name] = $this->input->post($name);
            }

            $config['upload_path']    = APPPATH."/uploads/article/";
            $config['allowed_types']  = 'gif|jpg|png|jpeg';
            $this->load->library('upload', $config);

            if ( $this->upload->do_upload('imgthumbUpload') ){
                $upload_data = $this->upload->data();
                $formdata["imgthumb"] = $upload_data['file_name'];
            } else {
                //$formdata["imgthumb"] = NULL;
                //bug($this->upload->display_errors());die;
            }

            if( !$crawler_source ){
                $add = $this->SlideShow_Model->update($formdata);
                if( $add ){
                    set_error(lang('Success.'));
                    $newUri = url_to_edit(null,$add);
                    return redirect($newUri, 'refresh');
                }
            } else {
                $this->load->module('crawler');
                list($c_title,$c_content,$c_thumb) = $this->crawler->get_content($crawler_source);
                if( !is_null($c_title) AND strlen($this->fields["title"]['value']) < 2 ){
                    $this->fields["title"]['value'] = $c_title;
                    $this->fields["content"]['value'] = $c_content;
                    $this->fields["imgthumb"]['value'] = $c_thumb;
                }
            }
        } else if( $id > 0 ){
            $item = $this->SlideShow_Model->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
        }
        if( $id > 0 ){
            set_temp_val('formTitle',lang("Edit") );
        } else {
            set_temp_val('formTitle',lang("Add new") );
        }

        $data = array(
            'fields' => $this->fields
        );

        add_js('crawler_form_actions.js');
        temp_view($this->formView,$data);
    }
}