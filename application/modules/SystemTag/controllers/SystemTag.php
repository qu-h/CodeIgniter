<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

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
        'id'=>array("#",5,true,'text-center'),
        'word'=>array("Keyword"),
        'actions'=>array('',5,false),
    );

    public function dataTable(){
        if( $this->uri->extension =='json' ){
            return $this->SystemTagModel->dataTableJson();
        }
        $data = columns_fields($this->table_fields);
        temp_view('datatables',$data);
    }

    public function form($id=0){
        $fields = $this->fields;
        if( $this->input->post() ){
            if( isset($_POST['cancel']) ){
                redirect('keyword');
                return FALSE;
            }

            $formdata = array();
            foreach ($fields as $name => $field) {
                $fields[$name]['value'] = $formdata[$name] = input_post($name);
            }
            $add = $this->SystemTagModel->update($formdata);
            if( $add ){
                $newUri = url_to_edit(null,$add);
                return redirect($newUri, 'refresh');
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