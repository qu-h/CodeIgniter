<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Article extends MX_Controller {

    function __construct()
    {
        parent::__construct();
        $this->load->model('backend/Article_Model');
        $this->load->model('backend/Category_Model');
        $this->load->module('layouts');
        $this->fields = $this->Article_Model->fields();
        if( !function_exists('columns_fields') ){
            $this->load->helper("backend/datatables");
        }

        //$this->template->set_theme('smartadmin')->set_layout('main');

    }

    var $table_fields = array(
        'id'=>array("#",5,true,'text-center'),
        'title'=>array("Title"),
        'category'=>array("Category"),
        'source'=>array('Source'),
        'news_actions'=>array('',5,false),
    );
    function items(){
        if( $this->uri->extension =='json' ){
            return $this->items_json_data(array_keys($this->table_fields));
        }

        $data = columns_fields($this->table_fields);
        $this->template
            //->title( lang('welcome_to').' '.config_item('company_name') )
            ->build('backend/datatables',$data);
    }

    private function items_json_data(){
        $category_id = null;
        if( isset($this->fields['category']['value']) && $this->fields['category']['value'] > 0 ){
            $category_id = $this->fields['category']['value'];
        }
        $this->Article_Model->items_json($category_id);
    }

    var $formView = "backend/article-form";

    public function form($id=0){
        header('X-XSS-Protection:0');
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
                $add = $this->Article_Model->update($formdata);
                if( $add ){
                    set_success(lang('Success.'));
                    $newUri = url_to_edit(null,$add);
                    if( input_post('back') ){
                        $newUri = url_to_list();
                    }
                    return redirect($newUri, 'refresh');
                } else {

                    return redirect(uri_string(), 'refresh');
                }

            } else {
                list($c_title,$c_content,$c_thumb) = Modules::run('crawler/get_content',$crawler_source);
                if( !is_null($c_title) AND strlen($this->fields["title"]['value']) < 2 ){
                    $this->fields["title"]['value'] = $c_title;
                    $this->fields["content"]['value'] = $c_content;
                    $this->fields["imgthumb"]['value'] = $c_thumb;
                }
            }
        } else {
            $item = $this->Article_Model->get_item_by_id($id);
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

    public function crawler(){
        $this->load->module('crawler');

        if( strlen($source = $this->input->get('s')) > 0 ){
            list($c_title,$c_content) = $this->crawler->get_content($source);

            if( is_string($c_title) ){
                $this->fields['title']['value']=$c_title;
                $this->fields['alias']['value']= url_title($c_title,'-',true);
            }
            if( is_string($c_content) ){
                $this->fields['content']['value']=$c_content;
            }

            $this->fields['source']['value']=$source;
        }

        if ($this->input->post()) {
            $formdata = array();
            foreach ($this->fields as $name => $field) {
                $formdata[$name] = $this->input->post($name);
            }
            if( !empty($formdata) AND ($add = $this->Article_Model->update($formdata)) ){
                set_error(lang('Success.'));
            }

        }

        $data = array(
            'fields' => $this->fields
        );
        $this->template
            ->title( lang('welcome_to'))
            ->build('backend/form',$data);
    }

    public function delete($id=0){
        $this->Article_Model->item_delete($id);
        $newUri = url_to_list();

        return redirect($newUri, 'refresh');
    }
}