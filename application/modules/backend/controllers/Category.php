<?php
if (! defined('BASEPATH'))
    exit('No direct script access allowed');

class Category extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->load->module('layouts');
        $this->template->set_theme('smartadmin')->set_layout('main');
        $this->load->model('backend/Category_Model');
        $this->fields = $this->Category_Model->fields();

    }

    var $table_fields = array(
        'id'=>array("#",9,true,'text-center'),
        'title'=>array("Title"),
        'actions'=>array(),
    );

    function items()
    {
        if( input_post("update-order") ){
            return $this->update_order(input_post('data'),0);
        }
        $items = $this->Category_Model->items_tree($this->fields["type"]["value"],0,2);
        $data['categories'] = $items;
        temp_view("categories",$data);
    }

    public function form($id = 0)
    {
        if ($this->input->post()) {


            $data = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $data[$name] = $this->input->post($name);
            }

            if( $submit =='trash' ){
                return $this->delete($data["id"]);
            }

            $add = $this->Category_Model->update($data);
            if( $add ){
                if( $id ){
                    set_success(lang('Edit Category success'));
                } else {
                    set_success(lang('Add new Category success'));
                }
                $id = $add;
            }

            return submit_redirect();

        }

        if ( $id > 0 ){
            $item = $this->Category_Model->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
        }

        $data = array(
            'fields' => $this->fields
        );
        temp_view('form', $data);
    }

    public function delete($id=0){
        $this->Category_Model->item_delete($id);
        $newUri = url_to_list();

        return redirect($newUri, 'refresh');
    }

    private function update_order($items=[],$parent_id=0){
        if( !empty($items) ) foreach ($items AS $i => $cate){
            $this->Category_Model->update(['id'=>$cate["id"],"ordering"=>$i+1,'parent'=>$parent_id],false);
            if( isset($cate["children"]) ){
                $this->update_order($cate["children"],$cate["id"]);
            }
        }
    }
}