<?php if (! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class BaseCategory
 * @property BaseCategoryModel $BaseCategoryModel
 */
class BaseCategory extends MX_Controller
{
    function __construct($type='category')
    {
        parent::__construct();
        $this->fields = $this->BaseCategoryModel->fields();
        $this->fields["type"]["value"] = $type;
        $this->fields["parent"]["category-type"] = $type;

    }

    var $table_fields = array(
        'id'=>array("#",9,true,'text-center'),
        'title'=>array("Title"),
        'actions'=>array(),
    );


    function items($level=2)
    {
        if( input_post("update-order") ){
            return $this->update_order(input_post('data'),0);
        }
        $items = $this->BaseCategoryModel->items_tree($this->fields["type"]["value"],0,$level);
        $data['categories'] = $items;

        add_git_assets('jquery.nestable.min.js','jquery/nestable');
        temp_view("categories",$data);
    }

    var $formView = "form";
    public function form($id = 0)
    {
        if ($this->input->post()) {
            $data = [];
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $data[$name] = $this->input->post($name);
            }
//            if( $submit =='trash' ){
//                return $this->delete($data["id"]);
//            }
            $add = $this->BaseCategoryModel->update($data);
            if( $add ){
                if( $id ){
                    set_success(lang('Edit Category success'));
                } else {
                    set_success(lang('Add new Category success'));
                }
                $id = $add;
            }
            return submit_redirect($id);
        }

        if ( $id > 0 ){
            $item = $this->BaseCategoryModel->get_item_by_id($id);
            foreach ($this->fields AS $field=>$val){
                if( isset($item->$field) ){
                    $this->fields[$field]['value']=$item->$field;
                }
            }
            $this->fields["parent"]["without_ids"] = [$id];
        }
        $data = array(
            'fields' => $this->fields
        );
        temp_view($this->formView, $data);
    }

    public function delete($id=0){
        $this->BaseCategoryModel->item_delete($id);
        $newUri = url_to_list();
        return redirect($newUri, 'refresh');
    }

    private function update_order($items=[],$parent_id=0){
        if( !empty($items) ) foreach ($items AS $i => $cate){
            $this->BaseCategoryModel->update(['id'=>$cate["id"],"ordering"=>$i+1,'parent'=>$parent_id],false);
            if( isset($cate["children"]) ){
                $this->update_order($cate["children"],$cate["id"]);
            }
        }
    }

    public function setType($value){
        $this->fields["type"]["value"] = $value;
        $this->fields["parent"]["category-type"] = $value;
    }
}