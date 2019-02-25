<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class SystemArticle
 * @property SystemArticleModel $SystemArticleModel
 * @property SystemCrawler $SystemCrawler
 */
class SystemArticle extends MX_Controller
{
    var $lazyLoad = false;
    function __construct()
    {
        parent::__construct();
        $this->load->module('layouts');
        if (!function_exists('columns_fields')) {
            $this->load->helper("backend/datatables");
        }
        $this->load->module('SystemCrawler');
        // $this->model->fields = $this->SystemArticleModel->fields();
    }

    var $table_fields = [
        'id' => array("#", 5, true, 'text-center'),
        'title' => array("Title", 30),
        'category_name' => array("Category", 10),
        'source' => ['Source', 5, false, 'text-center'],
        'tag_names' => ['Keywords', 10, false],
        'news_actions' => array('', 5, false),
    ];

    function items()
    {
        if ($this->uri->extension == 'json') {
            $category_id = null;
            if (isset($this->model->fields['category']['value']) && $this->model->fields['category']['value'] > 0) {
                $category_id = $this->model->fields['category']['value'];
            }
            return $this->SystemArticleModel->items_json($category_id);
        }
        $data = columns_fields($this->table_fields);
        temp_view('Backend/articles', $data);
    }

    var $formView = "backend/article-form";

    /**
     * @param int $id
     */
    public function form($id = 0)
    {
        header('X-XSS-Protection:0');
        if ($this->input->post()) {
            $crawlerSource = $this->input->post("crawler_source");

            $formData = [];
            foreach ($this->model->fields as $name => $field) {
                $this->model->fields[$name]['value'] = $formData[$name] = $this->input->post($name);
            }

            $config['upload_path'] = APPPATH . "/uploads/article/";
            $config['allowed_types'] = 'gif|jpg|png|jpeg';
            $this->load->library('upload', $config);

            if ($this->upload->do_upload('imgthumbUpload')) {
                $upload_data = $this->upload->data();
                $formData["imgthumb"] = $upload_data['file_name'];
            } else {
                //$formdata["imgthumb"] = NULL;
                //bug($this->upload->display_errors());die;
            }

            if (!$crawlerSource) {

                $add = $this->SystemArticleModel->update($formData);
                if ($add) {
                    set_success(lang('Success.'));
                    $newUri = url_to_edit(null, $add);
                    if (input_post('back')) {
                        $newUri = url_to_list();
                    }
                    return redirect($newUri, 'refresh');
                } else {
                    return redirect(uri_string(), 'refresh');
                }
            } else {
                $check = $this->model->where('source',$crawlerSource);
                if( ($row = $check->get_row()) != null ){
                    $uriEdit = url_to_edit(null, $row->id);
                    set_error('Dupplicate Article ' .  anchor($uriEdit, $row->title));
                    redirect($uriEdit);
                } else {
                    list($c_title, $c_content, $c_thumb) = Modules::run('SystemCrawler/get_content', $crawlerSource);
                    if (!is_null($c_title)) {
                        $this->model->fields["title"]['value'] = $c_title;
                        $this->model->fields["content"]['value'] = $c_content;
                        $this->model->fields["imgthumb"]['value'] = $c_thumb;
                    }
                }
            }
        } else {
            $item = $this->model->get_item_by_id($id);
            if ($id > 0) {
                $this->model->fields['source']['type'] = 'editable';
                $this->model->fields['alias']['type'] = 'editable';
            }
            foreach ($this->model->fields AS $field => $val) {
                if (isset($item->$field)) {
                    $this->model->fields[$field]['value'] = $item->$field;
                }
            }
        }
        if ($id > 0) {
            set_temp_val('formTitle', lang("Edit"));
        } else {
            set_temp_val('formTitle', lang("Add new"));
        }
        $this->LazyLoadImage();
        $data = array(
            'fields' => $this->model->fields
        );
        add_js('crawler_form_actions.js');
        temp_view($this->formView, $data);
    }

    public function crawler()
    {
        $this->load->module('SystemCrawler');

        if (strlen($source = $this->input->get('s')) > 0) {
            list($c_title, $c_content) = $this->SystemCrawler->get_content($source);

            if (is_string($c_title)) {
                $this->model->fields['title']['value'] = $c_title;
                $this->model->fields['alias']['value'] = url_title($c_title, '-', true);
            }
            if (is_string($c_content)) {
                $this->model->fields['content']['value'] = $c_content;
            }

            $this->model->fields['source']['value'] = $source;
        }

        if ($this->input->post()) {
            $formData = [];
            foreach ($this->model->fields as $name => $field) {
                $formData[$name] = $this->input->post($name);
            }
            if (!empty($formData) AND ($add = $this->SystemArticleModel->update($formData))) {
                set_error(lang('Success.'));
            }
        }

        $data = array(
            'fields' => $this->model->fields
        );
        $this->template
            ->title(lang('welcome_to'))
            ->build('backend/form', $data);
    }

    public function delete($id = 0)
    {
        $this->SystemArticleModel->item_delete($id);
        $newUri = url_to_list();

        return redirect($newUri, 'refresh');
    }

    private function LazyLoadImage(){
        if( $this->lazyLoad && !empty($this->model->fields) && array_key_exists('content',$this->model->fields) ){
            $html = $this->model->fields['content']['value'];
            $htmlDom = str_get_html($html);
            // Find all images
            foreach($htmlDom->find('img') as $img){
                $img->{'data-src'} = $img->src;
                $img->src = $this->config->item('theme_url').DS."images/no-image.svg";
                $img->class = "img-responsive";
                $img->style = null;
            }
            $this->model->fields['content']['value'] = $htmlDom->save();
            //dd($this->model->fields['content']['value']);
        }
    }
}