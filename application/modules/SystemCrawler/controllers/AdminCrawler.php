<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class AdminCrawler extends MX_Controller
{

    function __construct()
    {
        parent::__construct();
    }

    var $table_fields = array(
        'id'=>array("#",5,false,'text-center'),
        'domain'=>array("Domain",70),
        'article_count'=>array("Article Count",15,true,'text-center'),
        'actions'=>array(NULL,5,false,'text-center'),
    );

    public function items(){
        if ($this->uri->extension == 'json') {
            return $this->CrawlerMask_Model->items_json();
        }
        $data = columns_fields($this->table_fields);
        temp_view('backend/datatables', $data);
    }

    function form($id=0){
        $fields = $this->CrawlerMask_Model->mask_fields;
        if ($this->input->post()) {
            $formdata = array();
            foreach ($fields as $name => $field) {
                $fields[$name]['value'] = $formdata[$name] = input_post($name);
            }
            $add = $this->CrawlerMask_Model->update($formdata);
            if( $add ){
                $newUri = url_to_edit(null,$add);
                return redirect($newUri, 'refresh');
            }
        } else if ( $id > 0 ){
            $item = $this->CrawlerMask_Model->get_item_by_id($id);
            foreach ($fields AS $field=>$val){
                if( isset($item->$field) ){
                    $fields[$field]['value']=$item->$field;
                }
            }
        }

        if( $id > 0 ){
            set_temp_val('formTitle',lang("Edit Mask") );
        } else {
            set_temp_val('formTitle',lang("Add new Mask") );
        }

        $data = array(
            'fields' => $fields
        );
        temp_view('form',$data);
    }
}