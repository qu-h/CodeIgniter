<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Tag extends MX_Controller {

    function __construct()
    {
        parent::__construct();
        $this->load->model('Tag/Tag_Model');
        $this->model = $this->Tag_Model;
        $this->fields =  $this->Tag_Model->fields();
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
            return $this->Tag_Model->dataTableJson();
        }
        $data = columns_fields($this->table_fields);
        temp_view('backend/datatables',$data);
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
            $add = $this->Tag_Model->update($formdata);
            if( $add ){
                $newUri = url_to_edit(null,$add);
                return redirect($newUri, 'refresh');
            }
        }
        $this->formFill($id);
        temp_view("Tag/form",['fields'=>$this->fields]);
    }
}