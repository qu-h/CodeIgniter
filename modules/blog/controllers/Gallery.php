<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Gallery extends MX_Controller
{
    function __construct()
    {
        parent::__construct();
        $this->load->model('Gallery_Model');
        $this->load->module('layouts');
        $this->fields = $this->Gallery_Model->fields();
        set_temp_val('img_path',"gallery");
        add_site_structure('gallery',lang("Gallery") );
    }

    var $table_fields = array(
        'id'=>array("#",5,true,'text-center'),
        'image'=>array("Image"),
        'category'=>array("Category"),
        'actions'=>array(),
    );
    function items(){

        if( $this->uri->extension =='json' ){
            return $this->Gallery_Model->items_json();
        }

        $data = columns_fields($this->table_fields);

        $this->template->build('backend/datatables',$data);
    }

    var $formView = "blog/gallery-form";
    public function form($id=0){
        if ($this->input->post()) {

            $formdata = array();

            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $formdata[$name] = $this->input->post($name);
            }

            $add = $this->Gallery_Model->update($formdata);
            if( $add ){
                set_error(lang('Success.'));
                $newUri = url_to_edit(null,$add);
                if( input_post('back') ){
                    $newUri = url_to_list();
                }
                return redirect($newUri, 'refresh');
            }

        } else {
            $item = $this->Gallery_Model->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
        }
        if( $id > 0 ){
            set_temp_val('formTitle',lang("Edit Gallery") );
        } else {
            set_temp_val('formTitle',lang("Add new Gallery") );
        }
        $data = array(
            'fields' => $this->fields
        );

        temp_view($this->formView,$data);
    }


    /*
     * todo
     * Category of Gallery
     */

    public function category($action=NULL,$id=0){
        add_site_structure('position',lang("Category Management") );
        $this->positionFields = $this->Member_Model->positionFields();
        if( strlen($action) > 0 ){
            if( in_array($action,['edit','new','add']) ){
                return $this->positionForm($id);
            } else {
                show_404();
            }
        } else {
            return  $this->member->positionTable();
        }
    }

    var $formPositionView = "backend/form";
    public function positionForm($id=0){

        if ($this->input->post()) {

            $formdata = array();

            foreach ($this->positionFields as $name => $field) {
                $this->fields[$name]['value'] = $formdata[$name] = $this->input->post($name);
            }

            $add = $this->Member_Model->positionUpdate($formdata);
            if( $add ){
                set_error(lang('Success.'));
                $newUri = url_to_edit(null,$add);
                if( input_post('back') ){
                    $newUri = url_to_list();
                }
                return redirect($newUri, 'refresh');
            }

        } else if( $id > 0 ) {
            $item = $this->Member_Model->getPositionById($id);
            foreach ($this->positionFields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->positionFields[$field]['value']=$item->$field;
                }
            }
        }
        if( $id > 0 ){
            set_temp_val('formTitle',lang("Edit") );
        } else {
            set_temp_val('formTitle',lang("Add new") );
        }

        temp_view($this->formPositionView,['fields' => $this->positionFields]);
    }

    var $postionTableFields = array(
        'id'=>array("#",5,true,'text-center'),
        'title'=>array("Title"),
        'summary'=>array("Summary"),
        'actions'=>array(),
    );
    function positionTable(){

        if( $this->uri->extension =='json' ){
            return $this->Member_Model->positions_json();
        }

        $data = columns_fields($this->postionTableFields);

        $this->template->build('backend/datatables',$data);
    }
}