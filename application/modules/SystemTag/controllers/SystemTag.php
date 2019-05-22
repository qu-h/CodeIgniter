<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class SystemTag
 * @property SystemTagModel $SystemTagModel
 * @property CI_Output $output
 * @property array $fields
 */
class SystemTag extends MX_Controller {

    function __construct()
    {
        parent::__construct();
        $this->load->model('SystemTag/SystemTagModel');
        $this->model = $this->SystemTagModel;
        $this->fields =  $this->SystemTagModel->fields();
    }

    public function options_get(){

    }

    var $table_fields = array(
        'id'=>      ["#",5,true,'text-center'],
        'word'=>    ["Keyword"],
        'actions'=> ['',5,false]
    );

    public function dataTable(){
        if( $this->uri->extension =='json' ){
            return $this->SystemTagModel->items_json();
        }
        $data = columns_fields($this->table_fields);
        temp_view('datatables',$data);
    }

    /**
     * @param int $id
     * @return bool|void
     */
    public function form($id=0){
        $fields = $this->fields;
        if( $this->input->post() ){
            if( isset($_POST['cancel']) ){
                redirect('keyword');
                return false;
            }

            $formData = [];
            foreach ($fields as $name => $field) {
                $fields[$name]['value'] = $formData[$name] = input_post($name);
            }
            $add = $this->SystemTagModel->update($formData);
            if( $add ){
                $newUri = url_to_edit(null,$add);
                redirect($newUri, 'refresh');
                return false;
            }
        }
        $this->formFill($id);
        temp_view("Tag/form",['fields'=>$this->fields]);
    }

    public function typeHead(){
        $data = ["aaaa","bbb"];
        $this->output
            ->set_content_type('application/json')
            ->set_output(json_encode($data));
    }
}